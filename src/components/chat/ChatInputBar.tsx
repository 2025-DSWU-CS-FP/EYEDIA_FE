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
    <div className="max-w-[425px] w-screen px-4 py-3 bg-neutral-800 rounded-t-2xl flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
        placeholder="작품에 대해 질문해보세요"
        rows={1}
        className="resize-none max-h-[222px] overflow-y-auto bg-transparent text-white caret-cherry placeholder:text-neutral-500 text-sm font-normal outline-none w-full"
      />
      <div className="flex w-full justify-end gap-2">
        <button
          type="button"
          aria-label="음성 인식"
          className="w-10 h-10 rounded-full bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 flex items-center justify-center"
        >
          <img src={micIcon} alt="마이크" />
        </button>
        <button
          type="button"
          aria-label="보내기"
          onClick={handleSend}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
            ${inputValue.trim() ? 'bg-cherry hover:bg-cherry-hover active:bg-cherry-active' : 'bg-neutral-700'}`}
        >
          <SendIcon fill={inputValue.trim() ? '#ffffff' : '#696969'} />
        </button>
      </div>
    </div>
  );
}
