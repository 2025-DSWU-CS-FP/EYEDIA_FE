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
    <div className="max-w-[430px] w-screen px-[2.4rem] py-[1.8rem] bg-gray-10 rounded-t-[2.4rem] flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
        placeholder="작품에 대해 질문해보세요"
        rows={1}
        className="resize-none max-h-[222px] overflow-y-auto bg-transparent text-gray-90 caret-cherry placeholder:text-gray-50 text-bd2 font-normal outline-none w-full"
      />
      <div className="flex w-full justify-end gap-2">
        <button
          type="button"
          aria-label="음성 인식"
          className="py-[0.6rem] px-[1.3rem] rounded-full bg-gray-20 hover:bg-gray-30/90 active:bg-gray-30 flex items-center justify-center"
        >
          <img src={micIcon} alt="마이크" />
        </button>
        <button
          type="button"
          aria-label="보내기"
          onClick={handleSend}
          className={`py-[0.6rem] px-[1.3rem] rounded-full flex items-center justify-center transition-colors
            ${inputValue.trim() ? 'bg-brand-blue hover:bg-brand-blue-light' : 'bg-gray-20 cursor-default'}`}
        >
          <SendIcon fill={inputValue.trim() ? '#ffffff' : '#C4C8CD'} />
        </button>
      </div>
    </div>
  );
}
