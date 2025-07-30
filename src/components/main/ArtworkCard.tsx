import { ArtworkCardProps } from '@/types';

export default function ArtworkCard({
  title,
  artist,
  imageUrl,
}: ArtworkCardProps) {
  return (
    <div className="flex min-w-[21rem] flex-col gap-[0.8rem]">
      <img
        src={imageUrl}
        className="rounded-[12px]"
        loading="lazy"
        alt={title}
      />
      <div className="flex flex-col items-start justify-start gap-1">
        <span className="text-t5 text-gray-90">{title}</span>
        <div className="text-ct4 text-gray-50">{artist}</div>
      </div>
    </div>
  );
}
