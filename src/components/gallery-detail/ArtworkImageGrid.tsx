interface ArtworkImage {
  id: string;
  src: string;
}

interface ArtworkImageGridProps {
  images: ArtworkImage[];
  onClickImage?: (id: string) => void;
}

export default function ArtworkImageGrid({
  images,
  onClickImage,
}: ArtworkImageGridProps) {
  return (
    <div className="columns-2 gap-2 px-4 pb-10">
      {images.map(img => (
        <div
          key={img.id}
          role="button"
          tabIndex={0}
          onClick={() => onClickImage?.(img.id)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClickImage?.(img.id);
            }
          }}
          className="mb-2 cursor-pointer break-inside-avoid rounded-sm outline-none"
        >
          <img
            src={img.src}
            alt={`작품 이미지 ${img.id}`}
            className="w-full rounded-sm object-cover transition-transform duration-300 ease-in-out hover:scale-[1.02]"
          />
        </div>
      ))}
    </div>
  );
}
