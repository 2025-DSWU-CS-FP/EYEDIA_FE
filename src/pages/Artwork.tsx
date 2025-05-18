import { useRef, useState } from 'react';

import { FiHeart, FiShare, FiMenu } from 'react-icons/fi';
import { IoChevronBack } from 'react-icons/io5';

import '@/styles/glow-pulse.css';
import '@/styles/glow-pulse-before.css';

import keyboardIcon from '@/assets/icons/keyboard.svg';
import Sample from '@/assets/images/sample/chat-gaze.png';
import ArtworkBottomSheet from '@/components/bottomsheet/ArtworkBottomSheet';
import ChatInputBar from '@/components/chat/ChatInputBar';
import ChatMessage from '@/components/chat/ChatMessage';
import RoundedIconButton from '@/components/chat/RoundedIconButton';

interface Message {
  id: string;
  text: string;
}

export default function ArtworkPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecognized, setIsRecognized] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocusInput = () => {
    setShowChatInput(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: String(Date.now()),
      text: message,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="relative w-full max-w-md h-screen overflow-hidden bg-neutral-900 text-white">
      {/* 상단 이미지 배경 */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-[35vh]">
        <img
          src={Sample}
          alt="작품 이미지"
          className="w-full h-full object-cover select-none pointer-events-none touch-none"
          draggable={false}
        />
      </div>

      {/* 상단 고정 헤더 */}
      {isExpanded && (
        <div className="fixed bg-neutral-900 border-b-2 border-stone-900 top-0 left-1/2 -translate-x-1/2 w-full max-w-[425px] px-4 py-4 z-30">
          <div className="flex justify-between mx-5 text-2xl">
            <button type="button" className="hover:text-white/90">
              <IoChevronBack />
            </button>
            <button type="button" className="hover:text-white/90">
              <FiMenu />
            </button>
          </div>
          <div className="mt-4 flex justify-between max-w-[100%] items-end mx-7">
            <div className="flex flex-col gap-[3px]">
              <h1 className="text-lg font-normal">In Bed(2005)</h1>
              <p className="text-xs font-light text-[#8E8E8E]">
                론 뮤익(Ron Mueck)
              </p>
            </div>
            <div className="flex gap-2">
              <RoundedIconButton icon={<FiHeart />} />
              <RoundedIconButton icon={<FiShare />} />
            </div>
          </div>
        </div>
      )}

      <ArtworkBottomSheet isVisible onExpandChange={setIsExpanded}>
        <div className={`relative px-4 ${isExpanded ? 'pt-[112px]' : ''}`}>
          {!isExpanded && (
            <>
              <div className="fixed flex justify-end gap-2 right-7 -top-4 z-20">
                <RoundedIconButton icon={<FiHeart />} />
                <RoundedIconButton icon={<FiShare />} />
              </div>
              <div className="flex flex-col gap-2 mb-4 select-none">
                <div className="flex flex-col gap-[3px]">
                  <h1 className="text-2xl font-normal">In Bed(2005)</h1>
                  <p className="text-xs font-light">론 뮤익(Ron Mueck)</p>
                </div>
                <p className="text-xs text-neutral-400 pb-3 border-b-2 border-stone-900">
                  제 13회 서울미디어시티비엔날레
                </p>
              </div>
            </>
          )}

          <div className="my-4" />
          <ChatMessage text="무물이에게 작품에 대해 궁금한 점을 물어보세요(3초 이상 응시한 객체에 대해서 설명해 줍니다)." />

          <div className="mt-4 flex flex-col gap-2">
            {messages.map(msg => (
              <ChatMessage key={msg.id} text={msg.text} isFromUser />
            ))}
          </div>
        </div>
      </ArtworkBottomSheet>
      {!showChatInput && (
        <div className="absolute bottom-0 left-0 w-full px-6 pb-6 flex flex-col items-center">
          <p className="text-sm text-stone-300 mt-6">
            버튼을 누르고 작품에 대해 물어보세요.
          </p>
          <div className="relative w-20 h-20 mt-4">
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
          <div className="w-full flex justify-end">
            <input ref={inputRef} type="text" className="sr-only" />
            <button
              type="button"
              onClick={handleFocusInput}
              className="mt-4 w-12 h-9 bg-white/20 rounded-[40px] flex justify-center items-center"
            >
              <img src={keyboardIcon} alt="키보드" />
            </button>
          </div>
        </div>
      )}
      {showChatInput && (
        <div className="fixed left-1/2 -translate-x-1/2 max-w-[425px] bottom-0 w-full z-20">
          <ChatInputBar onSend={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
