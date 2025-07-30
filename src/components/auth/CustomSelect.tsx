import { useState, useRef, useEffect } from 'react';

import { IoChevronDown } from 'react-icons/io5';

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = '선택하세요',
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedLabel =
    options.find(option => option.value === value)?.label || '';

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex w-full items-center justify-between rounded-[6px] bg-white px-[1.6rem] py-[1.2rem] text-left text-bd2 text-gray-30 focus:border-brand-blue focus:text-gray-80 focus:outline-none"
      >
        {selectedLabel || placeholder}
        <IoChevronDown
          className={`ml-2 text-gray-40 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <ul className="absolute left-0 top-full mt-2 flex w-full flex-col rounded-[6px] border border-gray-10 bg-white shadow-md">
          {options.map(option => (
            <button
              type="button"
              key={option.value}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-[1.6rem] py-[1.2rem] text-left text-bd2 text-gray-60 hover:bg-gray-5"
            >
              {option.label}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
}
