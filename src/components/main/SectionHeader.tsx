import { SectionHeaderProps } from '@/types';

export default function SectionHeader({
  title,
  onMoreClick,
  showMore = true,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-t3 text-gray-90">{title}</h2>
      {showMore && (
        <button
          type="button"
          className="cursor-pointer text-bd2 text-gray-40"
          onClick={onMoreClick}
        >
          더보기
        </button>
      )}
    </div>
  );
}
