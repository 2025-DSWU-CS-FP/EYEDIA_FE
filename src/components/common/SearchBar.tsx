import React from 'react';

import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchBar({
  placeholder = '원하시는 전시를 검색해보세요',
  onSearch,
}: SearchBarProps) {
  const [input, setInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center rounded-full bg-white px-4 py-2 shadow-md"
    >
      <input
        type="text"
        className="flex-grow bg-transparent text-sm outline-none"
        placeholder={placeholder}
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button type="submit" aria-label="검색" title="검색">
        <Search size={18} className="text-gray-500" />
      </button>
    </form>
  );
}
