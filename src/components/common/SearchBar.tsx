import React from 'react';

import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  color?: 'white' | 'black';
}

export default function SearchBar({
  placeholder = '원하시는 전시를 검색해보세요',
  onSearch,
  color = 'white',
}: SearchBarProps) {
  const [input, setInput] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  const isBlack = color === 'black';
  const borderColor = isBlack ? 'border-black/60' : 'border-white/60';
  const bgColor = isBlack ? 'bg-lightGray' : 'bg-white/10';
  const textColor = isBlack
    ? 'text-black/70 placeholder-black/70'
    : 'text-white/80 placeholder-white/80';
  const circleBorder = isBlack ? 'border-black' : 'border-white';

  return (
    <form onSubmit={handleSubmit} className="relative w-80 h-10">
      <div
        className={`absolute left-0 top-0 w-80 h-10 rounded-sm ${bgColor} border ${borderColor}`}
      />
      <div
        className={`absolute left-[298px] top-[13px] w-3 h-3 rounded-full border ${circleBorder}`}
      />
      <div
        className={`absolute left-[308px] top-[24.34px] w-0.5 h-2 rotate-[-41.96deg] origin-top-left border ${circleBorder}`}
      />

      <input
        type="text"
        className={`absolute left-[12px] top-[12px] w-[250px] bg-transparent text-sm font-medium outline-none ${textColor}`}
        placeholder={placeholder}
        value={input}
        onChange={e => setInput(e.target.value)}
      />
    </form>
  );
}
