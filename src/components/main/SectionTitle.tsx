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
      <h2 className="text-base font-semibold">{title}</h2>
      {actionText && (
        <button
          type="button"
          onClick={onActionClick}
          className="text-sm text-gray-500"
        >
          {actionText} &gt;
        </button>
      )}
    </div>
  );
}
