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
import useDeletePainting from '@/services/mutations/useDeletePainting';
import useSaveScrap from '@/services/mutations/useSaveScrap';
import useChatMessages from '@/services/queries/useChatMessages';
import type { IncomingChat } from '@/types/chat';
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
  const navigate = useNavigate();
  const { state } = useLocation();
  const s = state as LocationState;
  const {
    paintingId,
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

  const deleteMutation = useDeletePainting();

  const {
    localMessages,
    setLocalMessages,
    typing,
    submitAsk,
    startVoice,
    promptText,
    voiceDisabled,
    didAutoAskRef,
    startTypewriter,
    speak,
  } = useArtworkChat({
    paintingId,
    onError: msg => showToast(msg, 'error'),
  });

  const spokenIdsRef = useRef<Set<string>>(new Set());

  const startTypewriterWithTTS = useCallback(
    (
      id: string,
      fullText: string,
      setText: (partial: string) => void,
      speed?: number,
    ) => {
      if (!spokenIdsRef.current.has(id)) {
        spokenIdsRef.current.add(id);
        speak(fullText);
      }
      startTypewriter(id, fullText, setText, speed);
    },
    [speak, startTypewriter],
  );

  const onRoomMessage = useRoomMessageHandler({
    paintingId,
    artworkInfo: { imgUrl: artworkInfo.imgUrl },
    processedIdsRef: processedRoomMessageIdsRef,
    setLocalMessages,
    startTypewriter: startTypewriterWithTTS,
    speak: () => {},
  });

  const { data: chatMessages } = useChatMessages(paintingId);
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

  const { connected, messages: wsMessages } = useStompChat({
    paintingId,
    token,
    topic: `/topic/llm.${paintingId}`,
    onRoomMessage,
  });

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
    [chatMessages, wsMessages, localMessages, typing, showChatInput],
    listRef,
  );
  const headerPromptText = useMemo(() => {
    if (!connected) return PROMPT_MESSAGES.checkingConnection;
    return promptText;
  }, [connected, promptText]);

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

  const handleDeletePainting = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(paintingId);
      showToast('작품이 삭제되었습니다.', 'success');
      navigate('/chat-onboarding', { replace: true });
    } catch {
      showToast('작품 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.', 'error');
    }
  }, [deleteMutation, paintingId, navigate, showToast]);

  useEffect(() => {
    if (!connected || didAutoAskRef.current) return;
    didAutoAskRef.current = true;
    setLocalMessages(prev => [
      ...prev,
      { id: nanoid(), sender: 'USER', type: 'IMAGE', imageUrl: sImgUrl },
    ]);
    submitAsk('이 그림에 대해 설명해줘', { showUserBubble: false });
  }, [connected, submitAsk, sImgUrl, didAutoAskRef, setLocalMessages]);

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
        <header className="fixed top-0 z-[1] w-full border-b-2 border-gray-10 bg-gray-5 pb-4">
          <Header
            onBackClick={handleDeletePainting}
            showBackButton
            backgroundColorClass="bg-gray-5"
          />
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
        <div className="mb-[2rem] flex h-full flex-col">
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {!isExpanded && (
              <div className="sticky top-0 z-10 bg-gray-5">
                <div className="absolute -top-4 right-7 z-20 flex items-center gap-2">
                  <RoundedIconButton size="lg" icon={<FiHeart />} />
                  <RoundedIconButton size="lg" icon={<FiShare />} />
                </div>

                <div className="mb-4 flex select-none flex-col gap-[1.8rem]">
                  <div className="px-[2.4rem]">
                    <div className="flex flex-col gap-[0.3rem]">
                      <h1 className="font-normal t3">{artworkInfo.title}</h1>
                      {artworkInfo.artist && (
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
              initial={initial}
              wsList={wsList}
              localMessages={localMessages}
              typing={typing}
              onExtract={quote => {
                setSelectionText(quote);
                setShowExtractCard(true);
              }}
              listRef={listRef}
              endRef={endRef}
            />
            <div ref={endRef} className="h-0" />
          </div>
        </div>
      </ArtworkBottomSheet>

      {showChatInput && (
        <div className="fixed bottom-0 z-20 w-full">
          <ChatInputBar
            onSend={v => submitAsk(v, { showUserBubble: true })}
            onMicClick={() => {
              setShowChatInput(false);
              if (!voiceDisabled) startVoice();
            }}
          />
        </div>
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
            onSave={handleSaveExcerpt}
            onShare={() => showToast('공유 기능은 준비 중이에요.', 'info')}
            aria-busy={saving}
            onClose={() => setShowExtractCard(false)}
          />
        </div>
      )}
    </section>
  );
}
