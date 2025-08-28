import { useEffect, useRef, useState } from 'react';

import { nanoid } from 'nanoid';
import { FiHeart, FiShare, FiMenu } from 'react-icons/fi';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import '@/styles/glow-pulse.css';
import '@/styles/glow-pulse-before.css';
import '@/styles/typing.css';

import keyboardIcon from '@/assets/icons/keyboard.svg';
import Sample from '@/assets/images/chat/image1.jpg';
import Sample2 from '@/assets/images/chat/image2.png';
import ArtworkBottomSheet from '@/components/bottomsheet/ArtworkBottomSheet';
import ChatInputBar from '@/components/chat/ChatInputBar';
import ChatMessage from '@/components/chat/ChatMessage';
import ExtractCard from '@/components/chat/ExtractCard';
import RoundedIconButton from '@/components/chat/RoundedIconButton';
import Divider from '@/components/mypage/Divider';
import useChatMessages from '@/services/queries/useChatMessages';

type MsgType = 'TEXT' | 'IMAGE';
type LocalMsg = {
  id: string;
  sender: 'USER' | 'BOT';
  type: MsgType;
  content?: string;
  imageUrl?: string;
};

const BOT_DEMO_TEXT =
  '지금 보신 이미지는 에드가 드가의 〈발레 수업〉 연작 가운데 한 장면입니다. 드가는 무대의 박수 대신 리허설실의 공기와 소음을 그리길 좋아했어요. 연두빛으로 낡아 보이는 벽과 높은 몰딩, 어두운 커튼이 공간을 정리하고, 그 안에서 하얀 튀튀들이 빛을 받아 부드럽게 번집니다. 화면에 잘린 이 부분은 전체 그림의 왼쪽 아래 구역으로, 지팡이를 짚고 서 있는 노신사가 파리 오페라의 발레 마스터 쥘 페로예요. 그는 지팡이로 박자를 두드리며 자세를 교정했고, 소녀들은 발을 푸느라 앉아 있거나 리본을 고치고, 팔짱을 끼고 차례를 기다립니다. 공연을 향한 ‘완벽한 포즈’가 아니라, 막간의 쉼‧정리‧대기가 겹치는 비극적인 순간들이 이 구도의 주인공이죠. 드가는 얼굴 표정보다 몸의 각도와 손의 동작으로 이야기를 쓰고, 대각선으로 비워 둔 공간과 한쪽으로 치우친 인물 배치로 스냅 사진처럼 우연한 느낌을 만듭니다.';

const SECONDE_DEMO_TEXT =
  '그 노인은 이 장면의 중심 축인 발레 마스터입니다. 드가는 연습실을 지휘하던 실제 인물을 모델로 삼았고(대개 19세기 낭만발레를 대표한 안무가로 알려져요), 그림이 그려질 무렵엔 예순을 훌쩍 넘긴 노년이었죠. 그는 회색빛 두툼한 외투 차림에 약간 굽은 허리로 서 있고, 지팡이를 악보 지휘봉처럼 바닥에 ‘탁’탁’ 두드려 박자를 잡거나 자세를 교정하는 도구로 쥐고 있습니다. 하얀 튀튀들 사이에서 유독 칙칙한 회색이 눈에 띄는 이유는, 드가가 무대의 요정 같은 소녀들과 현실의 노동·규율을 상징하는 교사를 색으로 분리했기 때문이에요. \n 구도상으로도 그는 왼쪽 모서리에 딱 붙어 서 있는데, 이 배치는 관람자의 시선을 그의 지팡이 → 소녀들의 대기 자세 → 방의 깊이 순으로 끌어들이는 장치입니다. 직선처럼 곧은 지팡이는 연습실의 수직·수평선(벽, 몰딩, 커튼)과 맞물려 리듬을 만들고, 반대로 소녀들의 사소한 몸짓은 그 리듬 위에서 흔들리는 생활의 시간을 보여줘요. 얼굴 표정은 크게 묘사하지 않지만, 약간 숙인 고개와 손의 각도만으로 권위·피로·집중이 동시에 읽히죠. 같은 연작의 다른 그림에서 그가 의자에 앉아 수업을 보기도 하는데, 여기서는 일부러 서 있는 포즈를 택해 ‘기다림을 끝내고 이제 지시가 떨어질 순간’의 긴장을 강조한 장면입니다.';

const DEMO_DELAY_MS = Number(import.meta.env.VITE_DEMO_DELAY_MS ?? 4000);
const VOICE_CAPTURE_MS = 3000;
const AUTO_GAZE_PRE_MS = Number(import.meta.env.VITE_AUTO_GAZE_PRE_MS ?? 600);
const AUTO_ONCE_KEY = 'ArtworkPage:autoOnce';

function TypingBubble() {
  return (
    <div className="flex items-start gap-[1rem]">
      <div className="rounded-[20px] bg-gray-10 px-[1.2rem] py-[0.8rem]">
        <span className="sr-only">상대가 입력 중…</span>
        <div className="flex items-end gap-[0.4rem]">
          <span className="typing-dot" />
          <span className="typing-dot delay-1" />
          <span className="typing-dot delay-2" />
        </div>
      </div>
    </div>
  );
}

function ImageMessage({
  src,
  isFromUser,
}: {
  src: string;
  isFromUser: boolean;
}) {
  return (
    <figure
      className={`max-w-[75%] overflow-hidden rounded-[20px] bg-gray-10 ${
        isFromUser ? 'self-end' : 'self-start'
      }`}
    >
      <img
        src={src}
        alt="선택한 부분 이미지"
        className="block h-auto w-full object-cover"
      />
    </figure>
  );
}

export default function ArtworkPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecognized, setIsRecognized] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const [selectionText, setSelectionText] = useState('');
  const [showExtractCard, setShowExtractCard] = useState(false);

  const [localMessages, setLocalMessages] = useState<LocalMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamed, setStreamed] = useState('');

  // 수동 음성 인식일 때만 "말씀하세요 :)" 문구 표시
  const [showSpeakHint, setShowSpeakHint] = useState(false);

  const voiceStepRef = useRef(0);
  const timers = useRef<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: chatMessages } = useChatMessages(4);
  const navigate = useNavigate();

  // 타이머 정리
  useEffect(() => {
    return () => {
      timers.current.forEach(t => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
      timers.current = [];
    };
  }, []);

  const handleFocusInput = () => {
    setShowChatInput(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    const doScroll = () => {
      endRef.current?.scrollIntoView({
        behavior: streaming ? 'auto' : 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    };
    requestAnimationFrame(doScroll);
  }, [chatMessages, localMessages, typing, streaming, streamed]);

  const getPromptText = () => {
    if (typing || streaming) return '답변을 생성하는 중이에요…';
    if (isRecognized && showSpeakHint) return '말씀하세요 :)';
    return '버튼을 누르고 작품에 대해 물어보세요.';
  };

  const scheduleBotStreaming = (botText: string) => {
    const t1 = window.setTimeout(
      () => setTyping(true),
      Math.max(0, DEMO_DELAY_MS - 2000),
    );

    const t2 = window.setTimeout(() => {
      setTyping(false);
      setStreaming(true);
      setStreamed('');

      const words = botText.split(' ');
      let i = 0;

      const iv = window.setInterval(() => {
        if (i >= words.length) {
          window.clearInterval(iv);
          setStreaming(false);
          setLocalMessages(prev => [
            ...prev,
            { id: nanoid(), content: botText, sender: 'BOT', type: 'TEXT' },
          ]);
          return;
        }
        const nextWord = words[i];
        i += 1;
        setStreamed(prev => (prev ? `${prev} ${nextWord}` : nextWord));
      }, 35);

      timers.current.push(iv as unknown as number);
    }, DEMO_DELAY_MS);

    timers.current.push(t1, t2);
  };

  const pushUserMessage = (text: string, botText: string = BOT_DEMO_TEXT) => {
    if (!text?.trim()) return;
    setLocalMessages(prev => [
      ...prev,
      { id: nanoid(), content: text.trim(), sender: 'USER', type: 'TEXT' },
    ]);
    scheduleBotStreaming(botText);
  };

  const startVoiceDemo = () => {
    if (isRecognized || typing || streaming) return;

    setShowSpeakHint(true);
    setIsRecognized(true);

    const t = window.setTimeout(() => {
      setIsRecognized(false);
      setShowSpeakHint(false);

      if (voiceStepRef.current === 0) {
        setLocalMessages(prev => [
          ...prev,
          { id: nanoid(), sender: 'USER', type: 'IMAGE', imageUrl: Sample2 },
        ]);
        scheduleBotStreaming(BOT_DEMO_TEXT);
        voiceStepRef.current = 1;
      } else {
        pushUserMessage('노신사에 대해서 더 설명해줘', SECONDE_DEMO_TEXT);
      }
    }, VOICE_CAPTURE_MS);
    timers.current.push(t);
  };

  useEffect(() => {
    if (import.meta.env.DEV) {
      sessionStorage.removeItem(AUTO_ONCE_KEY);
    }

    const shouldRun = !(
      import.meta.env.PROD && sessionStorage.getItem(AUTO_ONCE_KEY)
    );

    let rafId: number | null = null;
    let preTid: number | null = null;
    let listenTid: number | null = null;

    if (shouldRun) {
      rafId = requestAnimationFrame(() => {
        preTid = window.setTimeout(() => {
          setIsRecognized(true); // 자동 인식 애니메이션
          listenTid = window.setTimeout(() => {
            setIsRecognized(false);

            setLocalMessages(prev => [
              ...prev,
              {
                id: nanoid(),
                sender: 'USER',
                type: 'IMAGE',
                imageUrl: Sample2,
              },
            ]);

            scheduleBotStreaming(BOT_DEMO_TEXT);
            voiceStepRef.current = 1;

            if (import.meta.env.PROD) {
              sessionStorage.setItem(AUTO_ONCE_KEY, '1');
            }
          }, VOICE_CAPTURE_MS);

          if (listenTid) timers.current.push(listenTid);
        }, AUTO_GAZE_PRE_MS);

        if (preTid) timers.current.push(preTid);
      });
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (preTid !== null) window.clearTimeout(preTid);
      if (listenTid !== null) window.clearTimeout(listenTid);
    };
  }, []);

  const initial = (chatMessages ?? []).map(m => ({
    id: nanoid(),
    content: m.content,
    sender: m.sender as 'USER' | 'BOT',
    type: 'TEXT' as const,
  }));
  const allMessages = [...initial, ...localMessages];

  const voiceDisabled = isRecognized || typing || streaming;

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-gray-5 text-gray-100">
      {/* hero 이미지 */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
        <img
          src={Sample}
          alt="작품 이미지"
          className="pointer-events-none h-full min-h-[35vh] w-full touch-none select-none object-cover"
          draggable={false}
        />
      </div>

      {/* 상단 고정 헤더 (확장 시) */}
      {isExpanded && (
        <header className="fixed left-1/2 top-0 z-30 w-full max-w-[430px] -translate-x-1/2 border-b-2 border-gray-10 bg-gray-5 px-4 py-4">
          <div className="flex justify-between px-5 pb-[1rem] text-[24px] t2">
            <button
              onClick={() => navigate('/chat-gaze')}
              type="button"
              className="hover:text-gray-100/80"
              aria-label="뒤로 가기"
            >
              <IoChevronBack />
            </button>
            <button
              type="button"
              className="t2 hover:text-gray-100/80"
              aria-label="메뉴"
            >
              <FiMenu />
            </button>
          </div>
          <div className="mx-7 mt-4 flex max-w-[100%] items-end justify-between">
            <div className="flex flex-col gap-[0.3rem]">
              <h1 className="t5">발레 수업</h1>
              <p className="text-gray-70 ct5">에드가 드가</p>
            </div>
            <div className="flex gap-[0.8rem]">
              <RoundedIconButton size="lg" icon={<FiHeart />} />
              <RoundedIconButton size="lg" icon={<FiShare />} />
            </div>
          </div>
        </header>
      )}

      <ArtworkBottomSheet isVisible onExpandChange={setIsExpanded}>
        <main className={`relative ${isExpanded ? 'pt-[11.2rem]' : ''}`}>
          {!isExpanded && (
            <>
              <div className="fixed -top-4 right-7 z-20 flex justify-end gap-2">
                <RoundedIconButton size="lg" icon={<FiHeart />} />
                <RoundedIconButton size="lg" icon={<FiShare />} />
              </div>
              <div className="mb-4 flex select-none flex-col gap-[1.8rem]">
                <div className="px-[2.4rem]">
                  <div className="flex flex-col gap-[0.3rem]">
                    <h1 className="font-normal t1">발레 수업</h1>
                    <p className="text-gray-70 ct4">에드가 드가</p>
                  </div>
                  <p className="text-gray-50 ct4">한이음 전시회</p>
                </div>
                <Divider />
              </div>
            </>
          )}

          {/* 채팅 목록 */}
          <div
            ref={listRef}
            className="mt-4 flex h-full flex-col gap-[1.2rem] overflow-y-auto px-[1.8rem]"
          >
            {(!chatMessages || chatMessages.length === 0) &&
              localMessages.length === 0 && (
                <div className="pb-[1.2rem] pt-[1.6rem]">
                  <ChatMessage text="무물이에게 작품에 대해 궁금한 점을 물어보세요(2초 이상 응시한 객체에 대해서 설명해 줍니다)." />
                </div>
              )}

            {allMessages.map(msg =>
              msg.type === 'IMAGE' ? (
                <ImageMessage
                  key={msg.id}
                  src={msg.imageUrl!}
                  isFromUser={msg.sender === 'USER'}
                />
              ) : (
                <ChatMessage
                  key={msg.id}
                  text={msg.content!}
                  isFromUser={msg.sender === 'USER'}
                  onExtract={quote => {
                    setSelectionText(quote);
                    setShowExtractCard(true);
                  }}
                />
              ),
            )}

            {typing && <TypingBubble />}

            {streaming && streamed && (
              <ChatMessage
                key="streaming"
                text={streamed}
                isFromUser={false}
                onExtract={quote => {
                  setSelectionText(quote);
                  setShowExtractCard(true);
                }}
              />
            )}

            {/* ✅ 리스트 끝 앵커 */}
            <div ref={endRef} />
          </div>
        </main>
      </ArtworkBottomSheet>

      {/* 하단 인터랙션 */}
      {!showChatInput && (
        <footer className="pointer-events-none fixed bottom-0 left-0 flex w-full flex-col items-center bg-transparent px-6 pb-[10px]">
          {/* 오버레이는 클릭 차단하지 않도록 none */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-gray-5" />
          {/* 버튼 래퍼만 auto */}
          <div className="pointer-events-auto relative z-10 mt-[1.3rem] flex size-[12.8rem] items-center justify-center">
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
                disabled={voiceDisabled}
                aria-disabled={voiceDisabled}
                className="glow-pulse disabled:cursor-not-allowed disabled:opacity-50"
                onClick={startVoiceDemo}
              />
            )}
          </div>

          <p className="relative z-10 mt-6 text-gray-70 bd2">
            {getPromptText()}
          </p>

          <div className="pointer-events-auto relative z-10 mt-4 flex w-full justify-end">
            <input ref={inputRef} type="text" className="sr-only" />
            <button
              type="button"
              onClick={handleFocusInput}
              className="flex items-center justify-center rounded-[40px] bg-gray-10 px-[1.3rem] py-[0.6rem]"
              aria-label="키보드 입력으로 질문하기"
            >
              <img
                src={keyboardIcon}
                alt="키보드"
                className="w-[2.4rem] text-gray-80"
              />
            </button>
          </div>
        </footer>
      )}

      {showChatInput && (
        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2">
          <ChatInputBar onSend={txt => pushUserMessage(txt, BOT_DEMO_TEXT)} />
        </div>
      )}

      {showExtractCard && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
          <ExtractCard
            imageUrl={Sample}
            quote={selectionText}
            title="발레 수업"
            artist="에드가 드가"
            onSave={() => alert('이미지 저장')}
            onShare={() => alert('공유')}
          />
        </div>
      )}
    </section>
  );
}
