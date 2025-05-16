import { useState } from 'react';

import micIcon from '@/assets/icons/graphic_eq.svg';
import sendIcon from '@/assets/icons/sendIcon.svg';

interface ChatInputBarProps {
  onSend?: (message: string) => void;
}

export default function ChatInputBar({ onSend }: ChatInputBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend?.(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="w-full px-4 py-3 space-y-2 flex-col items-center bg-neutral-800 rounded-t-2xl gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder="작품에 대해 질문해보세요"
        className="flex-1 bg-transparent text-white caret-[#E83043] placeholder:text-neutral-500 text-sm font-normal outline-none"
      />
      <div className="flex w-full justify-end gap-2">
        <button
          type="button"
          aria-label="음성 인식"
          className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center"
        >
          <img src={micIcon} alt="마이크" />
        </button>
        <button
          type="button"
          aria-label="보내기"
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center"
        >
          <img src={sendIcon} alt="전송" />
        </button>
      </div>
    </div>
  );
}
