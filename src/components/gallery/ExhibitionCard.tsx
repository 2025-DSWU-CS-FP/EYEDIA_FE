interface ExhibitionCardProps {
  imageUrl: string;
  title?: string;
  subTitle: string;
  showArrow?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function ExhibitionCard({
  imageUrl,
  title,
  subTitle,
  showArrow,
  onClick,
  isSelected,
}: ExhibitionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[10px] transition-transform duration-200 ease-in-out"
    >
      <img
        src={imageUrl}
        alt={title ?? '작품 이미지'}
        className="h-full w-full object-cover"
      />
      {(title || showArrow) && (
        <div
          className={`absolute inset-0 transition-colors duration-200 ease-in-out ${isSelected ? 'bg-gray-900/40' : 'bg-black/0 group-hover:bg-gray-100/40'}`}
        >
          <div className="flex h-full flex-col justify-between p-[2rem] text-left opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
            <p className="text-ct1 text-gray-0">{title}</p>
            {showArrow && (
              <p className="text-ct3 font-bold text-gray-0">{subTitle}</p>
            )}
          </div>
        </div>
      )}
    </button>
  );
}
