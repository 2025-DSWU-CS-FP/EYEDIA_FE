import React from 'react';

import { FiSearch } from 'react-icons/fi';
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
  const iconColor = isBlack ? 'text-black/70' : 'text-white/80';

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-[90%] h-10 mx-auto"
    >
      <div
        className={`absolute inset-0 rounded-sm ${bgColor} border ${borderColor}`}
      />

      <input
        type="text"
        className={`absolute left-3 top-1/2 -translate-y-1/2 pr-10 w-[85%] bg-transparent text-sm font-medium outline-none ${textColor}`}
        placeholder={placeholder}
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      {/* 🔍 서치 아이콘 */}
      <button
        type="submit"
        className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor}`}
      >
        <FiSearch size={18} />
      </button>
    </form>
  );
}
