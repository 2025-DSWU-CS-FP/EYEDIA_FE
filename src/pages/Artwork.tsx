import { useRef, useState } from 'react';

import { FiHeart, FiShare } from 'react-icons/fi';

import '@/styles/glow-pulse.css';
import '@/styles/glow-pulse-before.css';

import keyboardIcon from '@/assets/icons/keyboard.svg';
import Sample from '@/assets/images/sample/chat-gaze.png';
import ChatInputBar from '@/components/chat/ChatInputBar';
import RoundedIconButton from '@/components/chat/RoundedIconButton';
import BackButton from '@/components/common/BackButton';

export default function ArtworkPage() {
  const [isRecognized, setIsRecognized] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocusInput = () => {
    setShowChatInput(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="relative w-full max-w-md h-screen bg-neutral-900 text-white overflow-hidden">
      <div className="relative w-full h-[230px]">
        <img
          src={Sample}
          alt="작품 이미지"
          className="w-full h-full object-cover rounded"
        />
        <div className="absolute top-4 left-4 z-20">
          <BackButton className="text-black" />
        </div>
        <div className="absolute right-4 bottom-[-16px] flex gap-2">
          <RoundedIconButton icon={<FiHeart />} />
          <RoundedIconButton icon={<FiShare />} />
        </div>
      </div>

      <div className="flex flex-col px-6 pt-6 pb-4 rounded-t-3xl bg-neutral-900 h-[calc(100%-230px)]">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-[3px]">
            <h1 className="text-3xl font-normal">In Bed(2005)</h1>
            <p className="text-xs font-light">론 뮤익(Ron Mueck)</p>
          </div>
          <p className="text-xs text-neutral-400">
            제 13회 서울미디어시티비엔날레
          </p>
        </div>
        <div className="my-4 border-t-2 border-stone-900" />
        <div className="bg-stone-50/10 rounded px-4 py-3 text-sm leading-tight">
          기본 설명 대화 텍스트(질문하지 않아도 기본으로 작성되는 설명글)
        </div>
        {!showChatInput && (
          <div className="mt-auto flex flex-col items-center">
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
      </div>
      {showChatInput && (
        <div className="absolute bottom-0 left-0 w-full z-30">
          <ChatInputBar />
        </div>
      )}
    </div>
  );
}
