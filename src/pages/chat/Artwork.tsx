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

  // 리스트/스크롤 ref
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // 중복 WS 메시지 방지 ref
  const processedRoomMessageIdsRef = useRef<Set<string>>(new Set());

  const token = getAuthToken();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 저장 뮤테이션
  const { mutate: saveScrap, isPending: saving } = useSaveScrap();

  // 삭제 뮤테이션
  const deleteMutation = useDeletePainting();

  // 채팅 훅 (로컬 메시지/음성/타자효과/질문 전송 등)
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

  // 과거 저장된 메시지
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

  // WS 메시지 핸들러 훅
  const onRoomMessage = useRoomMessageHandler({
    paintingId,
    artworkInfo: { imgUrl: artworkInfo.imgUrl },
    processedIdsRef: processedRoomMessageIdsRef,
    setLocalMessages,
    startTypewriter,
    speak,
  });

  // STOMP 구독
  const { connected, messages: wsMessages } = useStompChat({
    paintingId,
    token,
    topic: `/topic/llm.${paintingId}`,
    onRoomMessage,
  });

  // WS 수신 리스트(텍스트만)
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

  // 자동 스크롤
  useAutoScrollToEnd([chatMessages, wsMessages, localMessages, typing], endRef);

  // 상단 상태 문구 (연결 상태 반영)
  const headerPromptText = useMemo(() => {
    if (!connected) return PROMPT_MESSAGES.checkingConnection;
    return promptText;
  }, [connected, promptText]);

  // 발췌 저장
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

  // 삭제
  const handleDeletePainting = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(paintingId);
      showToast('작품이 삭제되었습니다.', 'success');
      navigate('/chat-onboarding', { replace: true });
    } catch {
      showToast('작품 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.', 'error');
    }
  }, [deleteMutation, paintingId, navigate, showToast]);

  // 최초 자동 질문(이미지 전송 + "설명해줘")
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
    <section className="relative h-dvh w-full overflow-hidden bg-gray-5 text-gray-100">
      {/* 배경 아트워크 이미지 */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
        <img
          src={artworkInfo.imgUrl}
          alt={artworkInfo.title}
          className="pointer-events-none h-full min-h-[35vh] w-full touch-none select-none object-cover"
          draggable={false}
        />
      </div>

      {/* 확장 시 헤더 */}
      {isExpanded && (
        <header className="sticky top-0 z-[1] w-full border-b-2 border-gray-10 bg-gray-5 pb-4">
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
        <main className={isExpanded ? 'relative pt-[1rem]' : 'relative'}>
          {!isExpanded && (
            <>
              <div className="fixed -top-4 right-7 z-20 flex items-center gap-2">
                <RoundedIconButton size="lg" icon={<FiHeart />} />
                <RoundedIconButton size="lg" icon={<FiShare />} />
              </div>

              <div className="mb-4 flex select-none flex-col gap-[1.8rem]">
                <div className="px-[2.4rem]">
                  <div className="flex flex-col gap-[0.3rem]">
                    <h1 className="font-normal t2">{artworkInfo.title}</h1>
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

          {/* 메시지 리스트 */}
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
        </main>
      </ArtworkBottomSheet>

      {/* 음성 버튼/프롬프트/키보드 버튼 */}
      {!showChatInput && (
        <footer className="pointer-events-none fixed bottom-0 left-0 flex w-full flex-col items-center bg-transparent px-6 pb-[1rem]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-gray-5" />
          <div className="pointer-events-auto relative z-10 mt-[1.3rem] flex size-[12.8rem] items-center justify-center">
            {/* 마이크 버튼 */}
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

      {/* 텍스트 입력 바 */}
      {showChatInput && (
        <div className="w full fixed bottom-0 left-1/2 z-20 max-w-[43rem] -translate-x-1/2">
          <ChatInputBar onSend={v => submitAsk(v, { showUserBubble: true })} />
        </div>
      )}

      {/* 발췌 저장 카드 */}
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
