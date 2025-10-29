import { useMemo, useRef, useState, useCallback, useEffect } from 'react';

import type { IMessage } from '@stomp/stompjs';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

import ChatInputBar from '@/components/chat/ChatInputBar';
import MessageList from '@/components/chat/MessageList';
import Divider from '@/components/mypage/Divider';
import { useToast } from '@/contexts/ToastContext';
import useStompChat from '@/hooks/use-stomp-chat';
import Header from '@/layouts/Header';
import useChatMessages from '@/services/queries/useChatMessages';
import type { ChatMessage } from '@/types';
import getAuthToken from '@/utils/getToken';

const PAINTING_ID = 419;

const h32 = (s: string): string => {
  const MOD = 0x100000000;
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(h, 131) + s.charCodeAt(i)) % MOD;
  }
  if (h < 0) h += MOD;
  return h.toString(16).padStart(8, '0');
};

const makeStableId = (sender: string, createdAt?: string, content?: string) => {
  const raw = `${sender}|${createdAt ?? ''}|${content ?? ''}`;
  const enc = encodeURIComponent(raw).slice(0, 80);
  return `srv-${enc}-${h32(raw)}`;
};

const mapSender = (s?: string): 'USER' | 'BOT' | 'SYSTEM' => {
  if (s === 'ASSISTANT') return 'BOT';
  if (s === 'SYSTEM') return 'SYSTEM';
  return 'USER';
};

const isImageUrl = (s: string): boolean => {
  try {
    if (!/^https?:\/\//i.test(s)) return false;
    const { pathname } = new URL(s);
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(pathname);
  } catch {
    return false;
  }
};

const URL_RE: RegExp =
  /(https?:\/\/[^\s)'"<>]+?\.(?:jpg|jpeg|png|webp|gif|svg))(?![^\s])/gi;

type Part = { kind: 'url' | 'text'; value: string };

export const extractParts = (text: string): Part[] => {
  const parts: Part[] = [];
  let lastIndex = 0;

  text.replace(URL_RE, (full: string, url: string, offset: number): string => {
    const pre = text.slice(lastIndex, offset).trim();
    if (pre) parts.push({ kind: 'text', value: pre });
    parts.push({ kind: 'url', value: url });
    lastIndex = offset + full.length;
    return full;
  });

  const tail = text.slice(lastIndex).trim();
  if (tail) parts.push({ kind: 'text', value: tail });

  if (parts.length === 0) {
    const v = text.trim();
    return v ? [{ kind: 'text', value: v }] : [];
  }
  return parts;
};

type ViewMessage = {
  id: string;
  sender: 'USER' | 'BOT' | 'SYSTEM';
  type: 'TEXT' | 'IMAGE';
  content?: string;
  imageUrl?: string;
};

const adaptMany = (m: ChatMessage, seq: number): ViewMessage[] => {
  const sender = mapSender((m as unknown as { sender?: string }).sender);
  const content = (m as unknown as { content?: string }).content ?? '';
  const createdAt = (m as unknown as { createdAt?: string }).createdAt ?? '';

  const baseId =
    (m as unknown as { id?: string | number }).id !== undefined
      ? `hist-${String((m as unknown as { id?: string | number }).id)}`
      : `hist-${makeStableId(sender, createdAt, content)}-${seq}`;

  const parts = extractParts(content);

  return parts.map((p, idx) => {
    if (p.kind === 'url' && isImageUrl(p.value)) {
      const suf = `#img-${idx}-${h32(p.value)}-${seq}`;
      return {
        id: `${baseId}${suf}`,
        sender,
        type: 'IMAGE',
        imageUrl: p.value,
      };
    }
    const txt = p.value.trim();
    const suf = `#txt-${idx}-${h32(txt)}-${seq}`;
    return {
      id: `${baseId}${suf}`,
      sender,
      type: 'TEXT',
      content: txt,
    };
  });
};

type RoomPayload = {
  paintingId: number;
  answer?: string | null;
  model?: string | null;
  imgUrl?: string | null;
  audioUrl?: string | null;
};

export default function ChatHistoryPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useChatMessages(PAINTING_ID);
  const historyList = useMemo(
    () => (data ?? []).flatMap((m, i) => adaptMany(m, i)),
    [data],
  );

  const token = getAuthToken();
  const processedRoomMessageIdsRef = useRef<Set<string>>(new Set());
  const [roomAppends, setRoomAppends] = useState<ViewMessage[]>([]);
  const [localMsgs, setLocalMsgs] = useState<ViewMessage[]>([]);
  const [connectedOnce, setConnectedOnce] = useState(false);

  const onRoomMessage = useCallback((frame: IMessage) => {
    const mid = frame.headers['message-id'] ?? '';
    if (mid && processedRoomMessageIdsRef.current.has(mid)) return;

    try {
      const payload = JSON.parse(frame.body) as RoomPayload;
      if (payload.paintingId !== PAINTING_ID) return;

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
        setRoomAppends(prev => [...prev, ...v]);
      }
    } catch {
      /*  */
    }
  }, []);

  const {
    connected,
    chatMessages: wsChats,
    send,
    resolvedPaintingId,
  } = useStompChat({
    paintingId: PAINTING_ID,
    token,
    onRoomMessage,
    topic: '/queue/events',
  });

  useEffect(() => {
    if (connected) setConnectedOnce(true);
  }, [connected]);

  const wsTextList: ViewMessage[] = useMemo(() => {
    return wsChats.map(m => {
      const sender = (m.sender as 'USER' | 'BOT' | 'SYSTEM') || 'SYSTEM';
      const base = `topic-${(m.id ?? nanoid()).toString()}`;
      if (isImageUrl(m.content)) {
        return {
          id: `${base}#img-${h32(m.content)}`,
          sender,
          type: 'IMAGE',
          imageUrl: m.content,
        };
      }
      const txt = (m.content ?? '').trim();
      return {
        id: `${base}#txt-${h32(txt)}`,
        sender,
        type: 'TEXT',
        content: txt,
      };
    });
  }, [wsChats]);

  const wsList = useMemo(
    () => [...historyList, ...localMsgs, ...wsTextList, ...roomAppends],
    [historyList, localMsgs, wsTextList, roomAppends],
  );

  useEffect(() => {
    if (!endRef.current) return;
    endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [wsList.length]);

  const handleSend = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      setLocalMsgs(prev => [
        ...prev,
        {
          id: `local-${nanoid()}#txt-${h32(text)}`,
          sender: 'USER',
          type: 'TEXT',
          content: text,
        },
      ]);
      send(text);
    },
    [send],
  );

  const quickAsk = useCallback(
    (q: string) => {
      handleSend(q);
      showToast('요청을 보냈어요.', 'info');
    },
    [handleSend, showToast],
  );

  return (
    <section className="relative mx-auto flex min-h-dvh w-full max-w-[43rem] flex-col bg-gray-5 text-gray-100">
      <header className="border-b-1 sticky top-0 z-[1] w-full border-gray-10 bg-gray-5">
        <Header
          onBackClick={() => navigate(-1)}
          showBackButton
          backgroundColorClass="bg-gray-5"
        />
        <div className="px-[2.3rem] pb-[1rem]">
          <h1 className="t3">채팅 기록</h1>
          <p className="text-gray-70 ct5">
            작품 ID {resolvedPaintingId ?? PAINTING_ID}
            {!connected && connectedOnce && ' · (재연결 중)'}
          </p>
        </div>
        <Divider />
      </header>

      {isLoading && (
        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-60 ct3">기록을 불러오는 중…</p>
        </main>
      )}

      {isError && (
        <main className="flex flex-1 items-center justify-center">
          <p className="text-brand-red ct3">기록을 불러오지 못했어요.</p>
        </main>
      )}

      {!isLoading && !isError && (
        <main className="flex flex-1">
          {wsList.length === 0 ? (
            <div className="mx-auto flex w-full max-w-[43rem] flex-1 items-center justify-center px-[2rem]">
              <p className="text-gray-60 ct3">아직 채팅 기록이 없어요.</p>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-[43rem] flex-1 flex-col">
              <MessageList
                wsList={wsList}
                localMessages={[]}
                typing={false}
                onExtract={quote => {
                  if (!quote.trim()) return;
                  showToast(
                    '발췌가 복사되었어요. 스크랩에서 저장할 수 있어요.',
                    'info',
                  );
                }}
                listRef={listRef}
                endRef={endRef}
              />
              <div ref={endRef} className="h-0" />
            </div>
          )}
        </main>
      )}

      <footer className="sticky bottom-0 z-[2] mx-auto w-full max-w-[43rem] from-gray-5 via-gray-5/95 to-gray-5/60 pt-2">
        <div className="mb-2 flex gap-2 px-2">
          <button
            type="button"
            className="bg-gray-15 active:bg-gray-25 rounded-full px-3 py-1.5 text-gray-80 ct4 hover:bg-gray-20"
            onClick={() => quickAsk('최근 답변을 3줄로 요약해줘')}
            disabled={!connected}
          >
            요약 요청
          </button>
          <button
            type="button"
            className="bg-gray-15 active:bg-gray-25 rounded-full px-3 py-1.5 text-gray-80 ct4 hover:bg-gray-20"
            onClick={() => quickAsk('이 대화의 핵심 키워드 5개만 뽑아줘')}
            disabled={!connected}
          >
            키워드 추출
          </button>
        </div>

        <ChatInputBar
          onSend={handleSend}
          onMicClick={() => {
            showToast('음성 입력은 작품 화면에서 지원해요.', 'info');
          }}
        />
      </footer>
    </section>
  );
}
