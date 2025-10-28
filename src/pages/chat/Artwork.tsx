import { useRef, useState, useMemo, useEffect, useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { FiHeart, FiShare } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import '@/styles/glow-pulse.css';
import '@/styles/glow-pulse-before.css';
import '@/styles/typing.css';
import keyboardIcon from '@/assets/icons/keyboard.svg';
import SampleFallback from '@/assets/images/chat/image1.jpg';
import ArtworkBottomSheet from '@/components/bottomsheet/ArtworkBottomSheet';
import ChatInputBar from '@/components/chat/ChatInputBar';
import ExtractCard from '@/components/chat/ExtractCard';
import MessageList from '@/components/chat/MessageList';
import RoundedIconButton from '@/components/chat/RoundedIconButton';
import Divider from '@/components/mypage/Divider';
import { PROMPT_MESSAGES } from '@/constants/promptMessages';
import { useToast } from '@/contexts/ToastContext';
import useStompChat from '@/hooks/use-stomp-chat';
import useArtworkChat from '@/hooks/useArtworkChat';
import useAutoScrollToEnd from '@/hooks/useAutoScrollToEnd';
import useRoomMessageHandler from '@/hooks/useRoomMessageHandler';
import Header from '@/layouts/Header';
import useSaveScrap from '@/services/mutations/useSaveScrap';
import type { IncomingChat } from '@/types/chat';
import type { LocalMsg } from '@/types/chatLocal';
import dateKST from '@/utils/dateKST';
import getAuthToken from '@/utils/getToken';

type LocationState = {
  paintingId?: number;
  title?: string;
  artist?: string;
  imgUrl?: string;
  description?: string;
  exhibition?: string;
};

const DEFAULT_EXHIBITION = '전시';

export default function ArtworkPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const s = (state ?? {}) as LocationState;

  const {
    paintingId: initialPaintingId,
    title: sTitle = '작품',
    artist: sArtist = '',
    imgUrl: sImgUrl = SampleFallback,
    exhibition = DEFAULT_EXHIBITION,
  } = s;

  const artworkInfo = { title: sTitle, artist: sArtist, imgUrl: sImgUrl };
  const exhibitionName = exhibition;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const [selectionText, setSelectionText] = useState('');
  const [showExtractCard, setShowExtractCard] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const processedRoomMessageIdsRef = useRef<Set<string>>(new Set());

  const token = getAuthToken();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: saveScrap, isPending: saving } = useSaveScrap();

  /* ========= TDZ 회피용 프록시 refs ========= */
  const setLocalMessagesRef = useRef<null | React.Dispatch<
    React.SetStateAction<LocalMsg[]>
  >>(null);

  const startTypewriterRef = useRef<
    | ((
        id: string,
        fullText: string,
        setText: (partial: string) => void,
        speed?: number,
      ) => void)
    | null
  >(null);

  const setLocalMessagesSafe: React.Dispatch<
    React.SetStateAction<LocalMsg[]>
  > = updater => {
    if (setLocalMessagesRef.current) setLocalMessagesRef.current(updater);
  };

  const startTypewriterSafe = (
    id: string,
    fullText: string,
    setText: (partial: string) => void,
    speed?: number,
  ) => {
    if (startTypewriterRef.current) {
      startTypewriterRef.current(id, fullText, setText, speed);
    }
  };

  /* ========= onRoomMessage (프록시 사용) ========= */
  const onRoomMessage = useRoomMessageHandler({
    paintingId: initialPaintingId ?? 0,
    artworkInfo: { imgUrl: artworkInfo.imgUrl },
    processedIdsRef: processedRoomMessageIdsRef,
    setLocalMessages: setLocalMessagesSafe,
    startTypewriter: startTypewriterSafe,
    speak: () => {},
  });

  /* ========= STOMP: 이벤트 큐 → 방 구독 순서 보장 ========= */
  const {
    connected,
    chatMessages: wsMessages,
    send,
    resolvedPaintingId,
  } = useStompChat({
    paintingId: initialPaintingId,
    token,
    onRoomMessage,
  });

  /* ========= 채팅/음성 훅 ========= */
  const {
    localMessages,
    setLocalMessages,
    typing,
    stopTyping,
    submitAsk,
    startVoice,
    promptText,
    voiceDisabled,
    didAutoAskRef,
    startTypewriter,
    speak,
  } = useArtworkChat({
    paintingId: resolvedPaintingId ?? initialPaintingId ?? 0,
    onError: msg => showToast(msg, 'error'),
    send,
  });

  /* ========= TTS + 타자 효과 ========= */
  const spokenIdsRef = useRef<Set<string>>(new Set());
  const startTypewriterWithTTS = useCallback(
    (
      id: string,
      fullText: string,
      setText: (partial: string) => void,
      speed?: number,
    ) => {
      stopTyping();
      if (!spokenIdsRef.current.has(id)) {
        spokenIdsRef.current.add(id);
        speak(fullText);
      }
      startTypewriter(id, fullText, setText, speed);
    },
    [speak, startTypewriter, stopTyping],
  );

  /* 실제 구현체를 프록시 ref에 연결 */
  useEffect(() => {
    setLocalMessagesRef.current = setLocalMessages;
    startTypewriterRef.current = startTypewriterWithTTS;
  }, [setLocalMessages, startTypewriterWithTTS]);

  /* ========= WS 메시지 → 렌더용 리스트 ========= */
  const wsList: Array<{
    id: string;
    sender: 'USER' | 'BOT' | 'SYSTEM';
    type: 'TEXT';
    content: string;
  }> = wsMessages.map((m: IncomingChat) => ({
    id: m.id ?? nanoid(),
    sender: m.sender,
    content: m.content,
    type: 'TEXT' as const,
  }));

  useAutoScrollToEnd(
    [wsMessages, localMessages, typing, showChatInput],
    listRef,
  );

  const headerPromptText = useMemo(() => {
    if (!connected) return PROMPT_MESSAGES.checkingConnection;
    return promptText;
  }, [connected, promptText]);

  /* ========= 발췌 저장 ========= */
  const lastSaveKeyRef = useRef<string | null>(null);
  const handleSaveExcerpt = (
    raw: string,
    { closeOnSuccess }: { closeOnSuccess: boolean },
  ) => {
    if (saving) return;
    const quote = raw.trim();
    if (!quote) {
      showToast('저장할 발췌 문구가 없어요.', 'error');
      return;
    }
    if (quote.length > 500) {
      showToast('발췌는 최대 500자까지 저장할 수 있어요.', 'error');
      return;
    }

    const pid = resolvedPaintingId ?? initialPaintingId ?? 0;
    const saveKey = `${pid}::${quote}`;
    if (lastSaveKeyRef.current === saveKey) {
      showToast('이미 같은 발췌를 저장했어요.', 'info');
      return;
    }
    lastSaveKeyRef.current = saveKey;

    saveScrap(
      {
        paintingId: pid,
        date: dateKST(),
        excerpt: quote,
        location: exhibitionName || '전시',
        artist: artworkInfo.artist,
      },
      {
        onSuccess: res => {
          showToast(res.message || '발췌를 저장했어요.', 'success');
          if (closeOnSuccess) setShowExtractCard(false);
          queryClient.invalidateQueries({ queryKey: ['recentViewedArtworks'] });
          queryClient.invalidateQueries({ queryKey: ['scrapsByExhibition'] });
          queryClient.invalidateQueries({ queryKey: ['scraps'] });
        },
        onError: () => {
          showToast('저장에 실패했어요. 다시 시도해 주세요.', 'error');
          lastSaveKeyRef.current = null;
        },
      },
    );
  };

  /* ========= 자동 첫 질문: paintingId 확정 후 1회 ========= */
  useEffect(() => {
    if (!connected || !resolvedPaintingId || didAutoAskRef.current) return;
    didAutoAskRef.current = true;

    setLocalMessages(prev => [
      ...prev,
      { id: nanoid(), sender: 'USER', type: 'IMAGE', imageUrl: sImgUrl },
    ]);

    submitAsk('이 그림에 대해 설명해줘', { showUserBubble: false });
  }, [
    connected,
    resolvedPaintingId,
    submitAsk,
    sImgUrl,
    didAutoAskRef,
    setLocalMessages,
  ]);

  return (
    <section className="relative h-dvh max-h-dvh w-full overflow-hidden bg-gray-5 text-gray-100">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
        <img
          src={artworkInfo.imgUrl}
          alt={artworkInfo.title}
          className="pointer-events-none h-full min-h-[35vh] w-full touch-none select-none object-cover"
          draggable={false}
        />
      </div>

      {isExpanded && (
        <header className="fixed top-0 z-[1] w-full max-w-[43rem] border-b-2 border-gray-10 bg-gray-5 pb-[1rem]">
          <Header
            onBackClick={() => navigate('/chat-onboarding')}
            showBackButton
            backgroundColorClass="bg-gray-5"
          />
          <div className="flex max-w-[100%] items-end justify-between px-[2.3rem]">
            <div className="flex flex-col gap-[0.3rem]">
              <h1 className="t3">{artworkInfo.title}</h1>
              {!!artworkInfo.artist && (
                <p className="text-gray-70 ct5">{artworkInfo.artist}</p>
              )}
            </div>
            <div className="flex gap-[0.8rem]">
              <RoundedIconButton size="lg" icon={<FiHeart />} />
              <RoundedIconButton size="lg" icon={<FiShare />} />
            </div>
          </div>
        </header>
      )}

      <ArtworkBottomSheet isVisible onExpandChange={setIsExpanded}>
        <div
          className={`mb-[1rem] flex h-full flex-col ${isExpanded ? 'pt-[15rem]' : ''}`}
        >
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {!isExpanded && (
              <div className="sticky top-0 z-30 bg-gray-5">
                <div className="fixed -top-4 right-7 z-20 flex items-center gap-[0.8rem]">
                  <RoundedIconButton size="lg" icon={<FiHeart />} />
                  <RoundedIconButton size="lg" icon={<FiShare />} />
                </div>

                <div className="mb-4 flex select-none flex-col gap-[1.8rem]">
                  <div className="px-[2.4rem]">
                    <div className="flex flex-col gap-[0.3rem]">
                      <h1 className="font-normal t3">{artworkInfo.title}</h1>
                      {!!artworkInfo.artist && (
                        <p className="text-gray-70 ct4">{artworkInfo.artist}</p>
                      )}
                    </div>
                    <p className="text-gray-50 ct4">{exhibitionName}</p>
                  </div>
                  <Divider />
                </div>
              </div>
            )}

            <MessageList
              wsList={wsList}
              localMessages={localMessages}
              typing={typing}
              onExtract={quote => {
                setSelectionText(quote);
                setShowExtractCard(true);
                handleSaveExcerpt(quote, { closeOnSuccess: false });
              }}
              listRef={listRef}
              endRef={endRef}
            />
            <div ref={endRef} className="h-0" />
          </div>
        </div>
      </ArtworkBottomSheet>

      {showChatInput && (
        <footer className="fixed bottom-0 z-20 w-full">
          <ChatInputBar
            onSend={v => submitAsk(v, { showUserBubble: true })}
            onMicClick={() => {
              setShowChatInput(false);
              if (!voiceDisabled) startVoice();
            }}
          />
        </footer>
      )}

      {!showChatInput && (
        <footer className="pointer-events-none fixed bottom-0 left-0 flex w-full flex-col items-center bg-transparent px-6 pb-[1rem]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-gray-5" />
          <div className="pointer-events-auto relative z-10 mt-[1.3rem] flex size-[12.8rem] items-center justify-center">
            {voiceDisabled ? (
              <button
                aria-label="음성 인식 시작"
                type="button"
                disabled
                aria-disabled
                className="glow-pulse disabled:cursor-not-allowed disabled:opacity-50"
              />
            ) : (
              <button
                aria-label="음성 인식 시작"
                type="button"
                className="glow-pulse"
                onClick={startVoice}
              />
            )}
          </div>

          <p className="relative z-10 mt-6 text-gray-70 bd2">
            {headerPromptText}
          </p>

          <div className="pointer-events-auto relative z-10 mx-auto mt-4 flex w-full max-w-[43rem] justify-end">
            <button
              type="button"
              onClick={() => setShowChatInput(true)}
              className="flex items-center justify-center rounded-[4rem] bg-gray-10 px-[1.3rem] py-[0.6rem] hover:bg-gray-20/80 active:bg-gray-20"
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

      {showExtractCard && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
          <ExtractCard
            imageUrl={artworkInfo.imgUrl}
            quote={selectionText}
            title={artworkInfo.title}
            artist={artworkInfo.artist}
            onSave={() =>
              handleSaveExcerpt(selectionText, { closeOnSuccess: true })
            }
            onShare={() => showToast('공유 기능은 준비 중이에요.', 'info')}
            aria-busy={saving}
            onClose={() => setShowExtractCard(false)}
          />
        </div>
      )}
    </section>
  );
}
