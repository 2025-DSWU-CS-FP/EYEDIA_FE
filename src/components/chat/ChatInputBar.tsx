import { useState, useRef, useEffect } from 'react';

import micIcon from '@/assets/icons/graphic_eq.svg';
import SendIcon from '@/components/common/SendIcon';

interface ChatInputBarProps {
  onSend?: (message: string) => void;
}

export default function ChatInputBar({ onSend }: ChatInputBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_H = 222;

  const canSend = inputValue.trim().length > 0;

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    onSend?.(text);
    setInputValue('');
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_H)}px`;
  }, [inputValue]);

  return (
    <div className="flex w-screen max-w-[430px] flex-col gap-2 rounded-t-[2.4rem] bg-gray-10 px-[2.4rem] py-[1.8rem]">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={e => {
          const isEnter = e.key === 'Enter';
          const isPlainEnter =
            isEnter && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey;
          const native = e.nativeEvent as KeyboardEvent;
          if (isPlainEnter && !isComposing && !native.isComposing) {
            e.preventDefault();
            e.stopPropagation();
            handleSend();
          }
        }}
        placeholder="작품에 대해 질문해보세요"
        rows={1}
        enterKeyHint="send"
        className="caret-cherry max-h-[22.2rem] w-full resize-none overflow-y-auto bg-transparent text-gray-90 outline-none bd2 placeholder:text-gray-50"
      />
      <div className="flex w-full justify-end gap-2">
        <button
          type="button"
          aria-label="음성 인식"
          className="flex items-center justify-center rounded-full bg-gray-20 px-[1.3rem] py-[0.6rem] hover:bg-gray-30/90 active:bg-gray-30"
        >
          <img src={micIcon} alt="마이크" />
        </button>
        <button
          type="button"
          aria-label="보내기"
          onClick={handleSend}
          disabled={!canSend}
          className={`flex items-center justify-center rounded-full px-[1.3rem] py-[0.6rem] transition-colors ${
            canSend
              ? 'bg-brand-blue hover:bg-brand-blue-light'
              : 'cursor-default bg-gray-20'
          }`}
        >
          <SendIcon fill={canSend ? '#ffffff' : '#C4C8CD'} />
        </button>
      </div>
    </div>
  );
}
