import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import type { IMessage } from '@stomp/stompjs';
import { nanoid } from 'nanoid';
import { useLocation, useNavigate } from 'react-router-dom';

import ChatInputBar from '@/components/chat/ChatInputBar';
import MessageList from '@/components/chat/MessageList';
import Divider from '@/components/mypage/Divider';
import { useToast } from '@/contexts/ToastContext';
import useStompChat from '@/hooks/use-stomp-history-chat';
import Header from '@/layouts/Header';
import useChatMessages from '@/services/queries/useChatMessages';
import type { ChatMessage } from '@/types';
import getAuthToken from '@/utils/getToken';

function h32(s: string): string {
  const MOD = 0x100000000;
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(h, 131) + s.charCodeAt(i)) % MOD;
  }
  if (h < 0) h += MOD;
  return h.toString(16).padStart(8, '0');
}

function makeStableId(
  sender: string,
  createdAt?: string,
  content?: string,
): string {
  const raw = `${sender}|${createdAt ?? ''}|${content ?? ''}`;
  const enc = encodeURIComponent(raw).slice(0, 80);
  return `srv-${enc}-${h32(raw)}`;
}

function mapSender(s?: string): 'USER' | 'BOT' | 'SYSTEM' {
  if (s === 'ASSISTANT') return 'BOT';
  if (s === 'SYSTEM') return 'SYSTEM';
  return 'USER';
}

function isImageUrl(s: string): boolean {
  try {
    if (!/^https?:\/\//i.test(s)) return false;
    const { pathname } = new URL(s);
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(pathname);
  } catch {
    return false;
  }
}

const URL_RE =
  /(https?:\/\/[^\s)'"<>]+?\.(?:jpg|jpeg|png|webp|gif|svg))(?![^\s])/gi;

type Part = { kind: 'url' | 'text'; value: string };

function extractParts(text: string): Part[] {
  const parts: Part[] = [];
  let lastIndex = 0;

  text.replace(
    URL_RE,
    function onMatch(full: string, url: string, offset: number): string {
      const pre = text.slice(lastIndex, offset).trim();
      if (pre) parts.push({ kind: 'text', value: pre });
      parts.push({ kind: 'url', value: url });
      lastIndex = offset + full.length;
      return full;
    },
  );

  const tail = text.slice(lastIndex).trim();
  if (tail) parts.push({ kind: 'text', value: tail });

  if (parts.length === 0) {
    const v = text.trim();
    return v ? [{ kind: 'text', value: v }] : [];
  }
  return parts;
}

type ViewMessage = {
  id: string;
  sender: 'USER' | 'BOT' | 'SYSTEM';
  type: 'TEXT' | 'IMAGE';
  content?: string;
  imageUrl?: string;
};

function isObjectRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object';
}

function getString(obj: unknown, key: string): string | undefined {
  if (isObjectRecord(obj)) {
    const v = obj[key];
    return typeof v === 'string' ? v : undefined;
  }
  return undefined;
}

function getStrOrNum(obj: unknown, key: string): string | number | undefined {
  if (isObjectRecord(obj)) {
    const v = obj[key];
    if (typeof v === 'string' || typeof v === 'number') return v;
  }
  return undefined;
}

function adaptMany(m: ChatMessage, seq: number): ViewMessage[] {
  const senderText = getString(m, 'sender');
  const sender = mapSender(senderText);
  const content = getString(m, 'content') ?? '';
  const createdAt = getString(m, 'createdAt') ?? '';
  const rawId = getStrOrNum(m, 'id');

  const baseId =
    rawId !== undefined
      ? `hist-${String(rawId)}`
      : `hist-${makeStableId(sender, createdAt, content)}-${seq}`;

  const parts = extractParts(content);
  const out: ViewMessage[] = [];

  for (let idx = 0; idx < parts.length; idx += 1) {
    const p = parts[idx];
    if (p.kind === 'url' && isImageUrl(p.value)) {
      const suf = `#img-${idx}-${h32(p.value)}-${seq}`;
      out.push({
        id: `${baseId}${suf}`,
        sender,
        type: 'IMAGE',
        imageUrl: p.value,
      });
    } else {
      const txt = p.value.trim();
      const suf = `#txt-${idx}-${h32(txt)}-${seq}`;
      out.push({ id: `${baseId}${suf}`, sender, type: 'TEXT', content: txt });
    }
  }
  return out;
}

type RoomPayload = {
  paintingId: number;
  answer?: string | null;
  model?: string | null;
  imgUrl?: string | null;
  audioUrl?: string | null;
};

type ChatState = {
  paintingId?: number;
  title?: string;
  author?: string;
  imageUrl?: string;
};

export default function ChatHistoryPage(): JSX.Element {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { state } = useLocation() as { state?: ChatState };
  const paintingId = useMemo(() => {
    const n = Number(state?.paintingId);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [state?.paintingId]);

  const didInitialScrollRef = useRef(false);

  const queryResult = useChatMessages(paintingId ?? 0);
  const { data, isError } = queryResult;
  const isSuccess = (queryResult as { isSuccess?: boolean }).isSuccess === true;

  const readyForWs = paintingId !== null && (isSuccess || isError);

  const historyList = useMemo(
    function buildHistory(): ViewMessage[] {
      const src = data ?? [];
      const out: ViewMessage[] = [];
      for (let i = 0; i < src.length; i += 1) {
        const chunk = adaptMany(src[i], i);
        for (let j = 0; j < chunk.length; j += 1) out.push(chunk[j]);
      }
      return out;
    },
    [data],
  );

  const token = getAuthToken();
  const processedRoomMessageIdsRef = useRef<Set<string>>(new Set());
  const [roomAppends, setRoomAppends] = useState<ViewMessage[]>([]);
  const [localMsgs, setLocalMsgs] = useState<ViewMessage[]>([]);

  useEffect(
    function resetOnRoomChange() {
      setRoomAppends([]);
      processedRoomMessageIdsRef.current = new Set();
    },
    [paintingId],
  );

  const onRoomMessage = useCallback(function onRoomMessage(
    frame: IMessage,
  ): void {
    const mid = frame.headers['message-id'] ?? '';
    if (mid && processedRoomMessageIdsRef.current.has(mid)) return;

    try {
      const payload = JSON.parse(frame.body) as RoomPayload;
      if (mid) processedRoomMessageIdsRef.current.add(mid);

      const v: ViewMessage[] = [];
      if (payload.imgUrl && isImageUrl(payload.imgUrl)) {
        v.push({
          id: `room-${nanoid()}#img-${h32(payload.imgUrl)}`,
          sender: 'USER',
          type: 'IMAGE',
          imageUrl: payload.imgUrl,
        });
      }
      if (payload.answer && payload.answer.trim()) {
        const txt = payload.answer.trim();
        v.push({
          id: `room-${nanoid()}#txt-${h32(txt)}`,
          sender: 'BOT',
          type: 'TEXT',
          content: txt,
        });
      }
      if (v.length > 0) {
        setRoomAppends(function concatPrev(prev) {
          return prev.concat(v);
        });
      }
    } catch {
      //
    }
  }, []);

  const ws = useStompChat({
    paintingId: readyForWs ? (paintingId ?? undefined) : undefined,
    token,
    onRoomMessage,
    topic: '/queue/events',
  });

  const { connected, chatMessages: wsChats, send } = ws;

  const wsTextList = useMemo(
    function buildWsList(): ViewMessage[] {
      const out: ViewMessage[] = [];
      for (let i = 0; i < wsChats.length; i += 1) {
        const raw = wsChats[i] as unknown;
        let sender: 'USER' | 'BOT' | 'SYSTEM' = 'SYSTEM';
        let content: string | undefined;
        let idVal: string | number | undefined;

        if (isObjectRecord(raw)) {
          const {
            sender: s,
            content: c,
            id,
          } = raw as {
            sender?: string;
            content?: string;
            id?: string | number;
          };
          if (typeof s === 'string') sender = s as 'USER' | 'BOT' | 'SYSTEM';
          if (typeof c === 'string') content = c;
          if (typeof id === 'string' || typeof id === 'number') idVal = id;
        }

        const base = `topic-${(idVal ?? nanoid()).toString()}`;

        if (content && isImageUrl(content)) {
          out.push({
            id: `${base}#img-${h32(content)}`,
            sender,
            type: 'IMAGE',
            imageUrl: content,
          });
        } else {
          const txt = (content ?? '').trim();
          out.push({
            id: `${base}#txt-${h32(txt)}`,
            sender,
            type: 'TEXT',
            content: txt,
          });
        }
      }
      return out;
    },
    [wsChats],
  );

  const wsList = useMemo(
    function mergeAll(): ViewMessage[] {
      return historyList
        .concat(localMsgs)
        .concat(wsTextList)
        .concat(roomAppends);
    },
    [historyList, localMsgs, wsTextList, roomAppends],
  );

  useEffect(
    function autoScrollOnListChange() {
      let tid: ReturnType<typeof setTimeout> | null = null;

      if (endRef.current) {
        tid = setTimeout(function run() {
          endRef.current?.scrollIntoView({
            behavior: didInitialScrollRef.current ? 'smooth' : 'auto',
            block: 'end',
          });

          if (!didInitialScrollRef.current) {
            didInitialScrollRef.current = true;
          }
        }, 0);
      }

      return function cleanup() {
        if (tid !== null) {
          clearTimeout(tid);
        }
      };
    },
    [wsList.length],
  );

  const handleBack = useCallback(
    function handleBack(): void {
      navigate(-1);
    },
    [navigate],
  );

  const handleSend = useCallback(
    function handleSend(rawText: string): void {
      const text = rawText.trim();
      if (!text) return;
      if (!readyForWs || !connected) return;

      setLocalMsgs(function append(prev) {
        return prev.concat({
          id: `local-${nanoid()}#txt-${h32(text)}`,
          sender: 'USER',
          type: 'TEXT',
          content: text,
        });
      });
      send(text);
    },
    [readyForWs, connected, send],
  );

  const handleMicClick = useCallback(
    function handleMicClick(): void {
      showToast('음성 입력은 작품 화면에서 지원해요.', 'info');
    },
    [showToast],
  );

  const handleSummary = useCallback(
    function handleSummary(): void {
      handleSend('최근 답변을 3줄로 요약해줘');
    },
    [handleSend],
  );

  const handleKeywords = useCallback(
    function handleKeywords(): void {
      handleSend('이 작품의 핵심 키워드 5개만 뽑아줘');
    },
    [handleSend],
  );

  const handleExtract = useCallback(
    function handleExtract(quote: string): void {
      if (!quote.trim()) return;
      showToast('발췌가 복사되었어요. 스크랩에서 저장할 수 있어요.', 'info');
    },
    [showToast],
  );

  return (
    <section className="relative mx-auto flex min-h-dvh w-full max-w-[43rem] flex-col bg-gray-5 text-gray-100">
      <header className="border-b-1 sticky top-0 z-[1] w-full border-gray-10 bg-gray-5">
        <Header
          onBackClick={handleBack}
          showBackButton
          backgroundColorClass="bg-gray-5"
        />
        <div className="px-[2.3rem] pb-[1rem]">
          <h1 className="t3">{state?.title ? `${state.title}` : '작품'}</h1>
          <p className="text-gray-70 ct5">{state?.author ?? ''}</p>
        </div>
        <Divider />
      </header>

      <main className="flex flex-1">
        {wsList.length === 0 ? (
          <div className="mx-auto flex w-full max-w-[43rem] flex-1 items-center justify-center px-[2rem]">
            <p className="text-gray-60 ct3">아직 채팅 기록이 없어요.</p>
          </div>
        ) : (
          <div
            ref={listRef}
            className="mx-auto flex w-full max-w-[43rem] flex-1 flex-col"
          >
            <MessageList
              wsList={wsList}
              localMessages={[]}
              typing={false}
              onExtract={handleExtract}
              listRef={listRef}
              endRef={endRef}
            />
            <div ref={endRef} className="h-[12rem]" />
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 z-[2] mx-auto w-full max-w-[43rem] from-gray-5 via-gray-5/95 to-gray-5/60 pt-2">
        <div className="mb-2 flex gap-2 px-2">
          <button
            type="button"
            className="bg-gray-15 active:bg-gray-25 rounded-full px-3 py-1.5 text-gray-80 ct4 hover:bg-gray-20"
            onClick={handleSummary}
            disabled={!connected || !readyForWs}
          >
            요약 요청
          </button>
          <button
            type="button"
            className="bg-gray-15 active:bg-gray-25 rounded-full px-3 py-1.5 text-gray-80 ct4 hover:bg-gray-20"
            onClick={handleKeywords}
            disabled={!connected || !readyForWs}
          >
            키워드 추출
          </button>
        </div>

        <ChatInputBar onSend={handleSend} onMicClick={handleMicClick} />
      </footer>
    </section>
  );
}
