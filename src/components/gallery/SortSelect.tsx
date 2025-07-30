import { useState } from 'react';

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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[0.4rem] rounded-[6px] bg-gray-0 px-[1.2rem] py-[0.8rem] text-ct3 text-gray-60"
      >
        {sort}
        <IoChevronDown className="text-gray-60" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[100px] rounded-[5px] bg-gray-0">
          {options.map(option => (
            <button
              type="button"
              key={option}
              className="cursor-pointer px-[1.2rem] py-[0.8rem] text-ct3 text-gray-60 hover:bg-gray-10"
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
