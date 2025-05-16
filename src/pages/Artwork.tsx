import { useRef, useState } from 'react';

import { FiHeart, FiShare } from 'react-icons/fi';

import '@/styles/glow-pulse.css';
import '@/styles/glow-pulse-before.css';

import keyboardIcon from '@/assets/icons/keyboard.svg';
import Sample from '@/assets/images/sample/chat-gaze.png';
import ArtworkBottomSheet from '@/components/bottomsheet/ArtworkBottomSheet';
import ChatInputBar from '@/components/chat/ChatInputBar';
import ChatMessage from '@/components/chat/ChatMessage';
import RoundedIconButton from '@/components/chat/RoundedIconButton';
import BackButton from '@/components/common/BackButton';
import MenuButton from '@/components/common/MenuButton';

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
      <div className="pointer-events-none absolute top-0 left-0 w-full h-[35vh]">
        <img
          src={Sample}
          alt="작품 이미지"
          className="w-full h-full object-cover select-none pointer-events-none touch-none"
          draggable={false}
        />
        <div className="absolute top-4">
          <BackButton className={isExpanded ? 'text-white' : 'text-black'} />
        </div>
        {isExpanded && (
          <div className="absolute top-4 right-4">
            <MenuButton className="text-white" />
          </div>
        )}
      </div>

      <ArtworkBottomSheet isVisible onExpandChange={setIsExpanded}>
        <div className="relative">
          <div
            className={`flex gap-2 ${isExpanded ? 'absolute right-4' : 'absolute right-4 top-[-16px]'} transition-all duration-300`}
          >
            <RoundedIconButton icon={<FiHeart />} />
            <RoundedIconButton icon={<FiShare />} />
          </div>

          <div
            className={`mt-${isExpanded ? '20' : '4'} mb-${isExpanded ? '6' : '4'} flex flex-col gap-2 transition-all duration-300 select-none`}
          >
            <div className="flex flex-col gap-[3px]">
              <h1
                className={`font-normal ${isExpanded ? 'text-lg' : 'text-3xl'} transition-all duration-300`}
              >
                In Bed(2005)
              </h1>
              <p className="font-light text-xs transition-all duration-300">
                론 뮤익(Ron Mueck)
              </p>
            </div>
            {!isExpanded && (
              <p className="text-neutral-400 text-xs ransition-all duration-300">
                제 13회 서울미디어시티비엔날레
              </p>
            )}
          </div>

          <div className="my-4 border-t-2 border-stone-900" />
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
        <div className="fixed left-1/2 -translate-x-1/2 max-w-[400px] bottom-0 w-full z-20">
          <ChatInputBar onSend={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
