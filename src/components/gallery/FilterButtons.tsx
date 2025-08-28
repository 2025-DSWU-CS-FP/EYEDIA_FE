type FilterValue = '전체' | '즐겨찾기';

interface FilterButtonsProps {
  filter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
}

export default function FilterButtons({
  filter,
  onFilterChange,
}: FilterButtonsProps) {
  const isAll = filter === '전체';
  const isBookmarked = filter === '즐겨찾기';

  const base = 'rounded-[6px] px-[1.2rem] py-[0.8rem] text-ct3';
  const active = 'bg-gray-90 text-white';
  const inactive = 'bg-gray-0 text-gray-60';

  return (
    <div className="flex gap-[0.8rem]">
      <button
        type="button"
        aria-pressed={isAll}
        className={`${base} ${isAll ? active : inactive}`}
        onClick={() => onFilterChange('전체')}
      >
        전체
      </button>
      <button
        type="button"
        aria-pressed={isBookmarked}
        className={`${base} ${isBookmarked ? active : inactive}`}
        onClick={() => onFilterChange(isBookmarked ? '전체' : '즐겨찾기')}
      >
        즐겨찾기만
      </button>
    </div>
  );
}
