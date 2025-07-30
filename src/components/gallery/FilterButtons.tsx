interface FilterButtonsProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterButtons({
  filter,
  onFilterChange,
}: FilterButtonsProps) {
  return (
    <>
      <button
        type="button"
        className={`rounded-[6px] px-4 py-2 text-ct3 font-medium ${
          filter === '전체'
            ? 'bg-gray-90 text-white'
            : 'border border-gray-30 bg-gray-0 text-gray-60'
        }`}
        onClick={() => onFilterChange('전체')}
      >
        전체
      </button>
      <button
        type="button"
        className={`rounded-[6px] px-4 py-2 text-ct3 font-medium ${
          filter === '즐겨찾기만'
            ? 'bg-gray-90 text-white'
            : 'border border-gray-30 bg-gray-0 text-gray-60'
        }`}
        onClick={() => onFilterChange('즐겨찾기만')}
      >
        즐겨찾기만
      </button>
    </>
  );
}
