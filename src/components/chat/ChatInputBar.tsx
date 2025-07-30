import { useState, useRef, useEffect } from 'react';

import micIcon from '@/assets/icons/graphic_eq.svg';
import SendIcon from '@/components/common/SendIcon';

interface ChatInputBarProps {
  onSend?: (message: string) => void;
}

export default function ChatInputBar({ onSend }: ChatInputBarProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend?.(inputValue.trim());
    setInputValue('');
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 164)}px`;
    }
  }, [inputValue]);

  return (
    <div className="flex w-screen max-w-[430px] flex-col gap-2 rounded-t-[2.4rem] bg-gray-10 px-[2.4rem] py-[1.8rem]">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
        placeholder="작품에 대해 질문해보세요"
        rows={1}
        className="caret-cherry max-h-[222px] w-full resize-none overflow-y-auto bg-transparent text-bd2 font-normal text-gray-90 outline-none placeholder:text-gray-50"
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
          className={`flex items-center justify-center rounded-full px-[1.3rem] py-[0.6rem] transition-colors ${inputValue.trim() ? 'bg-brand-blue hover:bg-brand-blue-light' : 'cursor-default bg-gray-20'}`}
        >
          <SendIcon fill={inputValue.trim() ? '#ffffff' : '#C4C8CD'} />
        </button>
      </div>
    </div>
  );
}
