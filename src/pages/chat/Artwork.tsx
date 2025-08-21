import { useEffect, useMemo, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { nanoid } from 'nanoid';
import { FiHeart, FiShare, FiMenu } from 'react-icons/fi';
import { IoChevronBack } from 'react-icons/io5';
import { useLocation, useParams } from 'react-router-dom';

import '@/styles/glow-pulse.css';
import '@/styles/glow-pulse-before.css';

import keyboardIcon from '@/assets/icons/keyboard.svg';
import Sample from '@/assets/images/sample/chat-gaze.png';
import ArtworkBottomSheet from '@/components/bottomsheet/ArtworkBottomSheet';
import ChatInputBar from '@/components/chat/ChatInputBar';
import ChatMessage from '@/components/chat/ChatMessage';
import ExtractCard from '@/components/chat/ExtractCard';
import RoundedIconButton from '@/components/chat/RoundedIconButton';
import Divider from '@/components/mypage/Divider';
import useChatMessages from '@/services/queries/useChatMessages';
import {
  ROOM_TOPIC,
  getAccessToken,
  makeStompClient,
} from '@/utils/stompClient';

type ArtworkInfo = { title: string; artist: string; imageUrl?: string };
type LocationState = { artwork?: ArtworkInfo };

export default function ArtworkPage() {
  const { roomId: roomParam = '0', conversationId } = useParams();
  const ridStr = roomParam || conversationId || '0';
  const roomId = useMemo(() => Number(ridStr), [ridStr]);

  const { state } = useLocation() as { state?: LocationState };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecognized, setIsRecognized] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const [selectionText, setSelectionText] = useState('');
  const [showExtractCard, setShowExtractCard] = useState(false);

  const { data: initialMessages } = useChatMessages(roomId);
  const [liveMessages, setLiveMessages] = useState<
    { id: string; content: string; sender: 'USER' | 'ASSISTANT' }[]
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const clientRef = useRef<Client | null>(null);
  const unsubRef = useRef<() => void>();
  const echoUnsubRef = useRef<() => void>();

  // STOMP 연결 + 구독
  useEffect(() => {
    if (!roomId) return;

    const token = getAccessToken();
    const client = makeStompClient(token);

    client.onConnect = () => {
      // 기존 구독 해제
      if (unsubRef.current) unsubRef.current();
      if (echoUnsubRef.current) echoUnsubRef.current();

      // 1) 방 브로드캐스트 구독 (/room/{roomId})
      const dest = ROOM_TOPIC(roomId);
      const sub = client.subscribe(dest, (m: IMessage) => {
        try {
          const payload = JSON.parse(m.body) as {
            sender?: string;
            content?: string;
          };
          if (!payload?.content) return;
          setLiveMessages(prev => [
            ...prev,
            {
              id: nanoid(),
              content: payload.content,
              sender: payload.sender === 'USER' ? 'USER' : 'ASSISTANT',
            },
          ]);
        } catch {
          /* 문자열 등은 무시 */
        }
      });
      unsubRef.current = () => sub.unsubscribe();

      // 2) (선택) 개인 큐 에코 수신
      const echo = client.subscribe('/user/queue/chat', (m: IMessage) => {
        try {
          const payload = JSON.parse(m.body) as {
            content?: string;
            sender?: string;
          };
          if (!payload?.content) return;
          setLiveMessages(prev => [
            ...prev,
            {
              id: nanoid(),
              content: payload.content,
              sender: payload.sender === 'USER' ? 'USER' : 'ASSISTANT',
            },
          ]);
        } catch {
          /* ignore */
        }
      });
      echoUnsubRef.current = () => echo.unsubscribe();
    };

    client.onStompError = frame => console.error('❌ STOMP ERROR', frame);
    client.onWebSocketError = evt => console.error('🧨 WS 에러:', evt);

    client.activate();
    clientRef.current = client;

    return () => {
      if (unsubRef.current) unsubRef.current();
      if (echoUnsubRef.current) echoUnsubRef.current();
      client.deactivate();
      clientRef.current = null;
    };
  }, [roomId]);

  const handleFocusInput = () => {
    setShowChatInput(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ✅ 전송: /app/chat.echo  (paintingId는 roomId)
  const handleSendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!clientRef.current?.connected || !roomId) return;

    // 낙관적 추가
    setLiveMessages(prev => [
      ...prev,
      { id: nanoid(), content: trimmed, sender: 'USER' },
    ]);

    const body = JSON.stringify({
      content: trimmed,
      paintingId: roomId,
      chatType: 'CHAT',
      timestamp: new Date().toISOString(),
      sender: 'USER',
    });

    try {
      clientRef.current.publish({
        destination: '/app/chat.echo',
        body,
        headers: { 'content-type': 'application/json' },
      });
    } catch (e) {
      console.error('메시지 발행 실패', e);
    }
  };

  const allMessages =
    (initialMessages ?? []).map(m => ({
      id: nanoid(),
      content: m.content,
      sender: (m.sender as 'USER' | 'ASSISTANT') ?? 'ASSISTANT',
    })) ?? [];
  const merged = allMessages.concat(liveMessages);

  const artwork = state?.artwork ?? {
    title: 'In Bed(2005)',
    artist: '론 뮤익(Ron Mueck)',
    imageUrl: Sample,
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-gray-5 text-gray-100">
      {/* 히어로 이미지 */}
      <div className="pointer-events-none absolute left-0 top-0 h-[35vh] w-full">
        <img
          src={artwork.imageUrl ?? Sample}
          alt="작품 이미지"
          className="pointer-events-none h-full w-full select-none object-cover"
          draggable={false}
        />
      </div>

      {/* 상단 고정 헤더(확장 시) */}
      {isExpanded && (
        <header className="fixed left-1/2 top-0 z-30 w-full max-w-[430px] -translate-x-1/2 border-b-2 border-gray-10 bg-gray-5 px-[2rem] py-[2rem]">
          <div className="flex justify-between px-[2.5rem] pb-[1rem] text-t2">
            <button type="button" className="hover:text-gray-100/80">
              <IoChevronBack />
            </button>
            <button type="button" className="text-t2 hover:text-gray-100/80">
              <FiMenu />
            </button>
          </div>
          <div className="mx-[2.8rem] mt-[1.6rem] flex max-w-full items-end justify-between">
            <div className="flex flex-col gap-[0.3rem]">
              <h1 className="text-t4">{artwork.title}</h1>
              <p className="text-ct5 text-gray-70">{artwork.artist}</p>
            </div>
            <div className="flex gap-[0.8rem]">
              <RoundedIconButton size="lg" icon={<FiHeart />} />
              <RoundedIconButton size="lg" icon={<FiShare />} />
            </div>
          </div>
        </header>
      )}

      {/* 바텀시트 + 채팅 */}
      <ArtworkBottomSheet isVisible onExpandChange={setIsExpanded}>
        <section className={`relative ${isExpanded ? 'pt-[11.2rem]' : ''}`}>
          {!isExpanded && (
            <>
              <div className="fixed -top-[0.4rem] right-[1.6rem] z-20 flex justify-end gap-[0.2rem]">
                <RoundedIconButton size="lg" icon={<FiHeart />} />
                <RoundedIconButton size="lg" icon={<FiShare />} />
              </div>

              <div className="mb-[1.6rem] flex select-none flex-col gap-[1.8rem]">
                <div className="px-[2.4rem]">
                  <div className="flex flex-col gap-[0.3rem]">
                    <h2 className="text-t1 font-normal">{artwork.title}</h2>
                    <p className="text-ct4 text-gray-70">{artwork.artist}</p>
                  </div>
                  <p className="text-ct4 text-gray-50">
                    제 13회 서울미디어시티비엔날레
                  </p>
                </div>
                <Divider />
              </div>
            </>
          )}

          {merged.length === 0 && (
            <div className="px-[1.8rem] pb-[1.2rem] pt-[1.6rem]">
              <ChatMessage text="무물이에게 작품에 대해 궁금한 점을 물어보세요(3초 이상 응시한 객체에 대해서 설명해 줍니다)." />
            </div>
          )}

          <ul className="mt-[1.2rem] flex flex-col gap-[1.2rem]">
            {merged.map(msg => (
              <li key={msg.id}>
                <ChatMessage
                  text={msg.content}
                  isFromUser={msg.sender === 'USER'}
                  onExtract={quote => {
                    setSelectionText(quote);
                    setShowExtractCard(true);
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      </ArtworkBottomSheet>

      {/* 음성/키보드 CTA */}
      {!showChatInput && (
        <aside className="absolute bottom-0 left-0 flex w-full flex-col items-center px-[2.4rem] pb-[2.4rem]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-100/0 to-neutral-100" />
          <p className="relative z-10 mt-[0.6rem] text-bd2 text-gray-70">
            버튼을 누르고 작품에 대해 물어보세요.
          </p>

          <div className="relative z-10 mt-[1.6rem] flex size-[12.8rem] items-center justify-center">
            {isRecognized ? (
              <>
                <span className="wave" />
                <span className="wave delay-1" />
                <span className="wave delay-2" />
                <div className="glow-core wave-border" />
              </>
            ) : (
              <button
                aria-label="음성 인식 시작"
                type="button"
                className="glow-pulse"
                onClick={() => setIsRecognized(true)}
              />
            )}
          </div>

          <div className="relative z-10 flex w-full justify-end">
            <input ref={inputRef} type="text" className="sr-only" />
            <button
              type="button"
              onClick={handleFocusInput}
              className="mt-[0.4rem] flex items-center justify-center rounded-[40px] bg-gray-10 px-[1.3rem] py-[0.6rem]"
            >
              <img
                src={keyboardIcon}
                alt="키보드"
                className="w-[2.4rem] text-gray-80"
              />
            </button>
          </div>
        </aside>
      )}

      {showChatInput && (
        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2">
          <ChatInputBar onSend={handleSendMessage} />
        </div>
      )}

      {showExtractCard && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/80">
          <ExtractCard
            imageUrl={artwork.imageUrl ?? Sample}
            quote={selectionText}
            title={artwork.title}
            artist="론 뮤익"
            onSave={() => alert('이미지 저장')}
            onShare={() => alert('공유')}
          />
        </div>
      )}
    </main>
  );
}
