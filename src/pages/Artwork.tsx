import { useRef, useState } from 'react';

import { nanoid } from 'nanoid';
import { FiHeart, FiShare, FiMenu } from 'react-icons/fi';
import { IoChevronBack } from 'react-icons/io5';
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

export default function ArtworkPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecognized, setIsRecognized] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const [selectionText, setSelectionText] = useState('');
  const [showExtractCard, setShowExtractCard] = useState(false);
  const { data: chatMessages } = useChatMessages(4);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocusInput = () => {
    setShowChatInput(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-5 text-gray-100">
      <div className="pointer-events-none absolute left-0 top-0 h-[35vh] w-full">
        <img
          src={Sample}
          alt="작품 이미지"
          className="pointer-events-none h-full w-full touch-none select-none object-cover"
          draggable={false}
        />
      </div>

      {isExpanded && (
        <div className="fixed left-1/2 top-0 z-30 w-full max-w-[430px] -translate-x-1/2 border-b-2 border-gray-10 bg-gray-5 px-4 py-4">
          <div className="flex justify-between px-5 pb-[1rem] text-[24px] text-t2">
            <button type="button" className="hover:text-gray-100/80">
              <IoChevronBack />
            </button>
            <button type="button" className="text-t2 hover:text-gray-100/80">
              <FiMenu />
            </button>
          </div>
          <div className="mx-7 mt-4 flex max-w-[100%] items-end justify-between">
            <div className="flex flex-col gap-[3px]">
              <h1 className="text-t4">In Bed(2005)</h1>
              <p className="text-ct5 text-gray-70">론 뮤익(Ron Mueck)</p>
            </div>
            <div className="flex gap-[0.8rem]">
              <RoundedIconButton size="lg" icon={<FiHeart />} />
              <RoundedIconButton size="lg" icon={<FiShare />} />
            </div>
          </div>
        </div>
      )}

      <ArtworkBottomSheet isVisible onExpandChange={setIsExpanded}>
        <div className={`relative ${isExpanded ? 'pt-[112px]' : ''}`}>
          {!isExpanded && (
            <>
              <div className="fixed -top-4 right-7 z-20 flex justify-end gap-2">
                <RoundedIconButton size="lg" icon={<FiHeart />} />
                <RoundedIconButton size="lg" icon={<FiShare />} />
              </div>
              <div className="mb-4 flex select-none flex-col gap-[1.8rem]">
                <div className="px-[2.4rem]">
                  <div className="flex flex-col gap-[0.3rem]">
                    <h1 className="text-t1 font-normal">In Bed(2005)</h1>
                    <p className="text-ct4 text-gray-70">론 뮤익(Ron Mueck)</p>
                  </div>
                  <p className="text-ct4 text-gray-50">
                    제 13회 서울미디어시티비엔날레
                  </p>
                </div>
                <Divider />
              </div>
            </>
          )}
          {(!chatMessages || chatMessages.length === 0) && (
            <div className="px-[1.8rem] pb-[1.2rem] pt-[1.6rem]">
              <ChatMessage text="무물이에게 작품에 대해 궁금한 점을 물어보세요(3초 이상 응시한 객체에 대해서 설명해 줍니다)." />
            </div>
          )}
          <div className="mt-4 flex flex-col gap-[1.2rem]">
            {chatMessages?.map(msg => (
              <ChatMessage
                key={nanoid()}
                text={msg.content}
                isFromUser={msg.sender === 'USER'}
                onExtract={quote => {
                  setSelectionText(quote);
                  setShowExtractCard(true);
                }}
              />
            ))}
          </div>
        </div>
      </ArtworkBottomSheet>
      {!showChatInput && (
        <div className="absolute bottom-0 left-0 flex w-full flex-col items-center px-6 pb-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-100/0 to-neutral-100" />
          <p className="relative z-10 mt-6 text-bd2 text-gray-70">
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
              className="mt-4 flex items-center justify-center rounded-[40px] bg-gray-10 px-[1.3rem] py-[0.6rem]"
            >
              <img
                src={keyboardIcon}
                alt="키보드"
                className="w-[2.4rem] text-gray-80"
              />
            </button>
          </div>
        </div>
      )}
      {showChatInput && (
        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2">
          {/* TODO: onSend={handleSendMessage} 추가하기 */}
          <ChatInputBar />
        </div>
      )}
      {showExtractCard && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/80">
          <ExtractCard
            imageUrl={Sample}
            quote={selectionText}
            title="In Bed(2005)"
            artist="론 뮤익"
            onSave={() => alert('이미지 저장')}
            onShare={() => alert('공유')}
          />
        </div>
      )}
    </div>
  );
}
