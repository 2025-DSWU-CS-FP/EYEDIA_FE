import { IoSearch } from 'react-icons/io5';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = '전시/작품 이름으로 검색',
}: SearchBarProps) {
  return (
    <div className="flex items-center justify-between rounded-[8px] bg-white px-[2rem] py-[1rem] shadow-sm">
      <input
        className="flex-1 bg-transparent text-gray-60 outline-none ct3 placeholder:text-gray-60"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <IoSearch className="ml-2 text-gray-60" size={20} />
    </div>
  );
}
