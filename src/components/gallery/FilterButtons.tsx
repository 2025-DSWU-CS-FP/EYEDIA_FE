interface FilterButtonsProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterButtons({
  filter,
  onFilterChange,
}: FilterButtonsProps) {
  return (
    <div className="flex gap-[0.8rem]">
      <button
        type="button"
        className={`rounded-[6px] px-[1.2rem] py-[0.8rem] text-ct3 ${
          filter === '전체' ? 'bg-gray-90 text-white' : 'bg-gray-0 text-gray-60'
        }`}
        onClick={() => onFilterChange('전체')}
      >
        전체
      </button>
      <button
        type="button"
        className={`rounded-[6px] px-[1.2rem] py-[0.8rem] text-ct3 ${
          filter === '즐겨찾기만'
            ? 'bg-gray-90 text-white'
            : 'bg-gray-0 text-gray-60'
        }`}
        onClick={() => onFilterChange('즐겨찾기만')}
      >
        즐겨찾기만
      </button>
    </div>
  );
}
