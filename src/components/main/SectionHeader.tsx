import { SectionHeaderProps } from '@/types';

export default function SectionHeader({
  title,
  onMoreClick,
  showMore = true,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between pr-[2.7rem]">
      <h2 className="text-gray-90 t3">{title}</h2>
      {showMore && (
        <button
          type="button"
          className="cursor-pointer text-gray-40 bd2"
          onClick={onMoreClick}
        >
          더보기
        </button>
      )}
    </div>
  );
}
