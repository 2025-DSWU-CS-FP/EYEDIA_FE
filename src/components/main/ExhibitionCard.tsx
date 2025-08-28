import { useState } from 'react';

import { ExhibitionCardProps } from '@/types';
import cn from '@/utils/cn';

interface ExhibitionCardExtendedProps extends ExhibitionCardProps {
  id: number | string;
  className?: string;
  imageClassName?: string;
  isLoading?: boolean;
  onClick?: (id: number | string) => void;
}

export default function ExhibitionCard({
  id,
  title,
  location,
  imageUrl,
  artworkCount,
  className = '',
  imageClassName = '',
  isLoading,
  onClick,
}: ExhibitionCardExtendedProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const showSkeleton = isLoading ?? !imgLoaded;

  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      disabled={showSkeleton}
      aria-busy={showSkeleton}
      aria-live="polite"
      className={cn(
        'group flex cursor-pointer flex-col items-start justify-start gap-[0.4rem]',
        showSkeleton && 'cursor-default',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[12px]">
        <img
          src={imageUrl}
          alt={title ?? '전시 이미지'}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
          className={cn(
            'aspect-[3/4] w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110',
            showSkeleton ? 'opacity-0' : 'opacity-100',
            imageClassName,
          )}
        />

        {showSkeleton && (
          <div
            className={cn(
              'animate-pulse absolute inset-0 bg-gray-10',
              imageClassName,
            )}
          >
            <span className="sr-only">이미지를 불러오는 중…</span>
          </div>
        )}

        {!showSkeleton && artworkCount !== undefined && (
          <span className="absolute bottom-[0.8rem] right-[0.8rem] rounded-[4px] bg-gray-0 px-[0.8rem] py-[0.4rem] text-ct4 text-gray-90">
            {artworkCount}개 작품
          </span>
        )}

        {showSkeleton && artworkCount !== undefined && (
          <span className="animate-pulse absolute bottom-[0.8rem] right-[0.8rem] h-[2.4rem] w-[6.8rem] rounded-[4px] bg-gray-20/80" />
        )}
      </div>

      {showSkeleton ? (
        <div className="flex w-full flex-col items-start justify-start gap-[0.4rem]">
          <div className="animate-pulse h-[2rem] w-3/4 rounded-[6px] bg-gray-20" />
          <div className="animate-pulse h-[1.6rem] w-1/2 rounded-[6px] bg-gray-20" />
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start gap-[0.4rem]">
          <div className="line-clamp-1 break-words text-gray-90 t5">
            {title}
          </div>
          <div className="line-clamp-1 break-words text-gray-50 ct4">
            {location}
          </div>
        </div>
      )}
    </button>
  );
}
