import { useRef, useState, useMemo, useEffect, useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { FiHeart, FiShare } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import '@/styles/glow-pulse.css';
import '@/styles/glow-pulse-before.css';
import '@/styles/typing.css';
import keyboardIcon from '@/assets/icons/keyboard.svg';
import SampleFallback from '@/assets/images/chat/image1.jpg';
import SampleCrop from '@/assets/images/chat/image2.png';
import ArtworkBottomSheet from '@/components/bottomsheet/ArtworkBottomSheet';
import ChatInputBar from '@/components/chat/ChatInputBar';
import ChatMessage from '@/components/chat/ChatMessage';
import ExtractCard from '@/components/chat/ExtractCard';
import RoundedIconButton from '@/components/chat/RoundedIconButton';
import Divider from '@/components/mypage/Divider';
import { PROMPT_MESSAGES } from '@/constants/promptMessages';
import { useToast } from '@/contexts/ToastContext';
import useStompChat from '@/hooks/use-stomp-chat';
import useAbortControllerRef from '@/hooks/useAbortControllerRef';
import useAutoScrollToEnd from '@/hooks/useAutoScrollToEnd';
import useStt from '@/hooks/useSTT';
import useTimers from '@/hooks/useTimers';
import useTts from '@/hooks/useTTS';
import useTypewriter from '@/hooks/useTypewriter';
import Header from '@/layouts/Header';
import useSaveScrap from '@/services/mutations/useSaveScrap';
import useChatMessages from '@/services/queries/useChatMessages';
import { askArtworkLLM } from '@/services/ws/chat';
import type { IncomingChat } from '@/types/chat';
import type { LocalMsg } from '@/types/chatLocal';
import dateKST from '@/utils/dateKST';
import getAuthToken from '@/utils/getToken';

type LocationState = {
  paintingId: number;
  title?: string;
  artist?: string;
  imgUrl?: string;
  description?: string;
  exhibition?: string;
};

const DEFAULT_EXHIBITION = '전시';

export default function ArtworkPage() {
  const { state } = useLocation();
  const s = state as LocationState;
  const {
    paintingId,
    title: sTitle = '작품',
    artist: sArtist = '',
    imgUrl: sImgUrl = SampleFallback,
    exhibition = DEFAULT_EXHIBITION,
  } = s;

  const artworkInfo = {
    title: sTitle,
    artist: sArtist,
    imgUrl: sImgUrl,
  };
  const exhibitionName = exhibition;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const [selectionText, setSelectionText] = useState('');
  const [showExtractCard, setShowExtractCard] = useState(false);
  const [localMessages, setLocalMessages] = useState<LocalMsg[]>([]);
  const [typing, setTyping] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didAutoAskRef = useRef(false);

  const stt = useStt({
    lang: 'ko-KR',
    continuous: false,
    interimResults: true,
  });
  const tts = useTts({
    lang: 'ko-KR',
    rate: 1,
    voiceName: 'Google 한국의 여성',
  });

  const { data: chatMessages } = useChatMessages(paintingId);

  const token = getAuthToken();
  const { connected, messages: wsMessages } = useStompChat({
    paintingId,
    token,
    topic: `/topic/llm.${paintingId}`,
  });

  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: saveScrap, isPending: saving } = useSaveScrap();

  const { add } = useTimers();
  const ac = useAbortControllerRef();
  const { start: startTypewriter } = useTypewriter(add);

  useAutoScrollToEnd([chatMessages, wsMessages, localMessages, typing], endRef);

  const initial = useMemo(
    () =>
      (chatMessages ?? []).map(m => ({
        id: nanoid(),
        content: m.content,
        sender: m.sender as 'USER' | 'BOT',
        type: 'TEXT' as const,
      })),
    [chatMessages],
  );

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

  const promptText = useMemo(() => {
    if (!connected) return PROMPT_MESSAGES.checkingConnection;
    if (stt.listening) return PROMPT_MESSAGES.speaking;
    if (typing) return PROMPT_MESSAGES.generating;
    return PROMPT_MESSAGES.ask;
  }, [connected, stt.listening, typing]);

  const voiceDisabled =
    stt.listening ||
    typing ||
    !connected ||
    stt.status === 'denied' ||
    stt.status === 'unavailable';

  const handleSaveExcerpt = () => {
    const quote = selectionText.trim();
    if (!quote) {
      showToast('저장할 발췌 문구가 없어요.', 'error');
      return;
    }
    saveScrap(
      {
        paintingId,
        date: dateKST(),
        excerpt: quote,
        location: exhibitionName,
        artist: artworkInfo.artist,
      },
      {
        onSuccess: res => {
          showToast(res.message || '발췌를 저장했어요.', 'success');
          setShowExtractCard(false);
          queryClient.invalidateQueries({ queryKey: ['recentViewedArtworks'] });
          queryClient.invalidateQueries({ queryKey: ['scrapsByExhibition'] });
        },
        onError: () =>
          showToast('저장에 실패했어요. 다시 시도해 주세요.', 'error'),
      },
    );
  };

  const submitAsk = useCallback(
    async (raw: string, opts?: { showUserBubble?: boolean }) => {
      const text = raw.trim();
      if (!text) return;

      const showUserBubble = opts?.showUserBubble ?? true;
      if (showUserBubble) {
        setLocalMessages(prev => [
          ...prev,
          { id: nanoid(), sender: 'USER', type: 'TEXT', content: text },
        ]);
      }

      setTyping(true);
      try {
        const { signal: abortSignal } = ac.renew();
        const res = await askArtworkLLM({ paintingId, text }, abortSignal);
        setTyping(false);
        const botId = nanoid();
        setLocalMessages(prev => [
          ...prev,
          { id: botId, sender: 'BOT', type: 'TEXT', content: '' },
        ]);

        startTypewriter(
          botId,
          res.answer,
          partial => {
            setLocalMessages(prev =>
              prev.map(m => (m.id === botId ? { ...m, content: partial } : m)),
            );
            if (partial === res.answer) {
              tts.speak(res.answer);
            }
          },
          16,
        );
      } catch (e) {
        setTyping(false);
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          showToast('질문 전송에 실패했어요. 다시 시도해 주세요.', 'error');
        }
      }
    },
    [ac, paintingId, showToast, startTypewriter, tts],
  );

  const startVoice = () => {
    if (stt.listening || typing) return;
    stt.resetFinal();
    stt.start();
  };

  useEffect(() => {
    if (!stt.listening && stt.finalText.trim()) {
      const text = stt.finalText.trim();
      stt.resetFinal();
      submitAsk(text, { showUserBubble: true });
    }
  }, [stt.listening, stt.finalText, submitAsk, stt]);

  useEffect(() => {
    if (!connected || didAutoAskRef.current) return;
    didAutoAskRef.current = true;

    setLocalMessages(prev => [
      ...prev,
      { id: nanoid(), sender: 'USER', type: 'IMAGE', imageUrl: SampleCrop },
    ]);
    submitAsk('이 그림에 대해 설명해줘', { showUserBubble: false });
  }, [connected, submitAsk]);

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-gray-5 text-gray-100">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
        <img
          src={artworkInfo.imgUrl}
          alt={artworkInfo.title}
          className="pointer-events-none h-full min-h-[35vh] w-full touch-none select-none object-cover"
          draggable={false}
        />
      </div>

      {isExpanded && (
        <header className="absolute z-[1] w-full border-b-2 border-gray-10 bg-gray-5 pb-4">
          <Header showBackButton backgroundColorClass="bg-gray-5" />
          <div className="flex max-w-[100%] items-end justify-between px-[2.3rem]">
            <div className="flex flex-col gap-[0.3rem]">
              <h1 className="t3">{artworkInfo.title}</h1>
              {artworkInfo.artist && (
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
        <main className={isExpanded ? 'relative pt-[11.2rem]' : 'relative'}>
          {!isExpanded && (
            <>
              <div className="fixed -top-4 right-7 z-20 flex justify-end gap-2">
                <RoundedIconButton size="lg" icon={<FiHeart />} />
                <RoundedIconButton size="lg" icon={<FiShare />} />
              </div>
              <div className="mb-4 flex select-none flex-col gap-[1.8rem]">
                <div className="px-[2.4rem]">
                  <div className="flex flex-col gap-[0.3rem]">
                    <h1 className="font-normal t1">{artworkInfo.title}</h1>
                    {artworkInfo.artist && (
                      <p className="text-gray-70 ct4">{artworkInfo.artist}</p>
                    )}
                  </div>
                  <p className="text-gray-50 ct4">{exhibitionName}</p>
                </div>
                <Divider />
              </div>
            </>
          )}

          <div
            ref={listRef}
            className="flex h-full flex-col gap-[1.2rem] overflow-y-auto px-[1.8rem] pt-8"
          >
            {(!chatMessages || chatMessages.length === 0) &&
              localMessages.length === 0 &&
              wsMessages.length === 0 && (
                <div className="pb-[1.2rem] pt-[1.6rem]">
                  <ChatMessage text="무물이에게 작품에 대해 궁금한 점을 물어보세요(2초 이상 응시한 객체에 대해서 설명해 줍니다)." />
                </div>
              )}

            {[...initial, ...wsList, ...localMessages].map(m =>
              m.type === 'IMAGE' ? (
                <figure
                  key={m.id}
                  className="max-w-[75%] self-end overflow-hidden rounded-[20px] bg-gray-10"
                >
                  <img
                    src={m.imageUrl!}
                    alt="선택한 부분 이미지"
                    className="block h-auto w-full object-cover"
                  />
                </figure>
              ) : (
                <ChatMessage
                  key={m.id}
                  text={m.content!}
                  isFromUser={m.sender === 'USER'}
                  onExtract={quote => {
                    setSelectionText(quote);
                    setShowExtractCard(true);
                  }}
                />
              ),
            )}

            {typing && (
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
            )}

            <div ref={endRef} />
          </div>
        </main>
      </ArtworkBottomSheet>

      {!showChatInput && (
        <footer className="pointer-events-none fixed bottom-0 left-0 flex w-full flex-col items-center bg-transparent px-6 pb-[1rem]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-gray-5" />
          <div className="pointer-events-auto relative z-10 mt-[1.3rem] flex size-[12.8rem] items-center justify-center">
            {stt.listening ? (
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
                onClick={startVoice}
              />
            )}
            {stt.listening && (
              <p className="relative z-10 mt-4 line-clamp-2 max-w-[43rem] text-center text-gray-80 ct4">
                {stt.interim || stt.finalText || '듣고 있어요…'}
              </p>
            )}
          </div>

          <p className="relative z-10 mt-6 text-gray-70 bd2">{promptText}</p>

          <div className="pointer-events-auto relative z-10 mx-auto mt-4 flex w-full max-w-[43rem] justify-end">
            <input ref={inputRef} type="text" className="sr-only" />
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

      {showChatInput && (
        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[43rem] -translate-x-1/2">
          <ChatInputBar onSend={v => submitAsk(v, { showUserBubble: true })} />
        </div>
      )}

      {showExtractCard && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
          <ExtractCard
            imageUrl={artworkInfo.imgUrl}
            quote={selectionText}
            title={artworkInfo.title}
            artist={artworkInfo.artist}
            onSave={handleSaveExcerpt}
            onShare={() => showToast('공유 기능은 준비 중이에요.', 'info')}
            aria-busy={saving}
          />
        </div>
      )}
    </section>
  );
}
