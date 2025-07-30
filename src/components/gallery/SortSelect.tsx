import { useState, useEffect, useRef } from 'react';

import { IoChevronDown } from 'react-icons/io5';

interface SortSelectProps {
  sort: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function SortSelect({
  sort,
  onChange,
  options,
}: SortSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative z-10" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="정렬 옵션 선택"
        className="flex items-center gap-[0.4rem] rounded-[6px] bg-gray-0 px-[1.2rem] py-[0.8rem] text-ct3 text-gray-60"
      >
        {sort}
        <IoChevronDown className="text-gray-60" />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-full overflow-hidden rounded-[5px] bg-gray-0 shadow-md"
          role="listbox"
          aria-label="정렬 옵션"
        >
          {options.map((option, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === options.length - 1;
            return (
              <button
                type="button"
                key={option}
                className={`w-full cursor-pointer px-[1.2rem] py-[0.8rem] text-left text-ct3 text-gray-60 hover:bg-gray-5 ${
                  isFirst ? 'rounded-t-[5px]' : ''
                } ${isLast ? 'rounded-b-[5px]' : ''}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={sort === option}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
