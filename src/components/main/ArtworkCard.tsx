import { ArtworkCardProps } from '@/types';

export default function ArtworkCard({
  title,
  artist,
  imageUrl,
}: ArtworkCardProps) {
  return (
    <article className="flex min-w-[21rem] flex-col gap-[0.8rem]">
      <figure className="relative overflow-hidden rounded-[12px]">
        <img
          src={imageUrl}
          alt={title ?? '작품 이미지'}
          loading="lazy"
          decoding="async"
          draggable="false"
          className="h-[14rem] w-full rounded-[12px] object-cover"
        />
      </figure>

      <figcaption className="flex flex-col items-start justify-start gap-1">
        <span className="text-gray-90 t5">{title}</span>
        <span className="text-gray-50 ct4">{artist}</span>
      </figcaption>
    </article>
  );
}
