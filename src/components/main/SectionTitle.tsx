import { ChevronRight } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function SectionTitle({
  title,
  actionText,
  onActionClick,
}: SectionTitleProps) {
  return (
    <div className="my-4 flex items-center justify-between px-2">
      <h2 className="text-black text-lg font-semibold">{title}</h2>
      {actionText && (
        <button
          type="button"
          onClick={onActionClick}
          className="flex items-center gap-1 text-black text-xs font-medium"
        >
          <span>{actionText}</span>
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}
