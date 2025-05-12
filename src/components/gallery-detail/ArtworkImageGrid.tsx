interface ArtworkImage {
  id: string;
  src: string;
}
interface ArtworkImageGridProps {
  images: ArtworkImage[];
}

export default function ArtworkImageGrid({ images }: ArtworkImageGridProps) {
  return (
    <div className="px-4 pt-2 grid grid-cols-2 gap-2">
      {images.map(img => (
        <img
          key={img.id}
          src={img.src}
          alt={`작품 이미지 ${img.id}`}
          className="w-full rounded-sm object-cover"
        />
      ))}
    </div>
  );
}
