import { KeyboardEvent, useCallback } from 'react';

import { FiSearch } from 'react-icons/fi';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = '검색어를 입력해주세요',
  className = '',
}: SearchBarProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSubmit) {
        onSubmit();
      }
    },
    [onSubmit],
  );

  return (
    <div
      className={`bg-white rounded-lg px-4 py-3 shadow-md flex items-center gap-2 ${className}`}
    >
      <input
        type="text"
        className="flex-1 outline-none text-base text-neutral-600"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        aria-label="검색"
        onClick={onSubmit}
        className="text-neutral-600 text-xl"
      >
        <FiSearch />
      </button>
    </div>
  );
}
