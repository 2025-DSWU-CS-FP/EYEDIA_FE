import React from 'react';

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
    <form onSubmit={handleSubmit} className="relative w-80 h-10">
      <div className="absolute left-0 top-0 w-80 h-10 rounded-sm bg-white/10 border border-white/60" />

      <div className="absolute left-[298px] top-[13px] w-3 h-3 rounded-full border border-white" />
      <div className="absolute left-[308px] top-[24.34px] w-0.5 h-2 rotate-[-41.96deg] origin-top-left border border-white" />

      <input
        type="text"
        className="absolute left-[12px] top-[12px] w-[250px] bg-transparent text-white/80 text-sm outline-none placeholder-white/80"
        placeholder={placeholder}
        value={input}
        onChange={e => setInput(e.target.value)}
      />
    </form>
  );
}
