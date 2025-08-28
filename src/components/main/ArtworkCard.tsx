import { ArtworkCardProps } from '@/types';

export default function ArtworkCard({
  title,
  artist,
  imageUrl,
  isLoading = false,
}: ArtworkCardProps) {
  return (
    <article
      className="flex min-w-[21rem] flex-col gap-[0.8rem]"
      aria-busy={isLoading}
    >
      <figure className="relative overflow-hidden rounded-[12px]">
        {isLoading ? (
          <>
            <div className="animate-pulse h-[14.3rem] w-[21rem] bg-gray-10" />
            <span className="sr-only">작품 이미지를 불러오는 중…</span>
          </>
        ) : (
          <img
            src={imageUrl}
            alt={title ?? '작품 이미지'}
            loading="lazy"
            decoding="async"
            draggable="false"
            className="w-full rounded-[12px] object-cover"
          />
        )}
      </figure>

      {isLoading ? (
        <div className="flex flex-col gap-[0.4rem]">
          <div className="animate-pulse h-[2rem] w-3/4 rounded-[6px] bg-gray-20" />
          <div className="animate-pulse h-[1.6rem] w-1/2 rounded-[6px] bg-gray-20" />
        </div>
      ) : (
        <figcaption className="flex flex-col items-start justify-start gap-1">
          <span className="text-gray-90 t5">{title}</span>
          <span className="text-gray-50 ct4">{artist}</span>
        </figcaption>
      )}
    </article>
  );
}
