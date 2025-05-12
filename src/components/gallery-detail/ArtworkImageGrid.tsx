interface ArtworkImage {
  id: string;
  src: string;
}

interface ArtworkImageGridProps {
  images: ArtworkImage[];
}

export default function ArtworkImageGrid({ images }: ArtworkImageGridProps) {
  return (
    <div className="columns-2 gap-2 px-4 pb-10">
      {images.map(img => (
        <img
          key={img.id}
          src={img.src}
          alt={`작품 이미지 ${img.id}`}
          className="mb-2 w-full break-inside-avoid rounded-sm object-cover"
        />
      ))}
    </div>
  );
}
