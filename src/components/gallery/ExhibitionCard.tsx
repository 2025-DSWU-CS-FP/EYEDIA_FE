interface ExhibitionCardProps {
  imageUrl: string;
  title?: string;
  showArrow?: boolean;
}

export default function ExhibitionCard({
  imageUrl,
  title,
  showArrow,
}: ExhibitionCardProps) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-[10px]">
      <img
        src={imageUrl}
        alt={title ?? '작품 이미지'}
        className="h-full w-full object-cover"
      />
      {(title || showArrow) && (
        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 ease-in-out group-hover:bg-black/40">
          <div className="flex h-full flex-col justify-between p-[1.2rem] opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
            <p className="text-ct3 leading-snug text-white">{title}</p>
            {showArrow && (
              <p className="text-ct3 font-bold text-white">OF THE SEAS →</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
