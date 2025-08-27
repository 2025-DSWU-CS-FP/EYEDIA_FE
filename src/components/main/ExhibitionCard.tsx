import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ExhibitionCardProps } from '@/types';
import cn from '@/utils/cn';

interface ExhibitionCardExtendedProps extends ExhibitionCardProps {
  id: number | string;
  className?: string;
  imageClassName?: string;
  isLoading?: boolean;
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
}: ExhibitionCardExtendedProps) {
  const navigate = useNavigate();
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>(
    imageUrl ? 'loading' : 'error',
  );

  const showSkeleton = (isLoading ?? false) || imgStatus === 'loading';
  const showImage = !!imageUrl && imgStatus !== 'error';
  const canClick = !showSkeleton;

  const handleClick = () => {
    if (canClick) navigate(`/gallery/${id}`);
  };

  const altText = useMemo(
    () => (title ? `${title} 이미지` : '전시 이미지'),
    [title],
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canClick}
      aria-busy={showSkeleton}
      aria-live="polite"
      className={cn(
        'group flex w-full flex-col items-start justify-start gap-[0.4rem]',
        !canClick ? 'cursor-default' : 'cursor-pointer',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[12px]">
        <div className="aspect-[3/4] w-full">
          {showImage && (
            <img
              src={imageUrl}
              alt={altText}
              onLoad={() => setImgStatus('loaded')}
              onError={() => setImgStatus('error')}
              className={cn(
                'h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110',
                showSkeleton ? 'opacity-0' : 'opacity-100',
                imageClassName,
              )}
            />
          )}

          {!showImage && !showSkeleton && (
            <div
              className={cn(
                'flex h-full w-full items-center justify-center bg-gray-10 text-gray-40',
                imageClassName,
              )}
            >
              <span className="ct4">이미지 없음</span>
            </div>
          )}
        </div>

        {showSkeleton && (
          <div className="animate-pulse absolute inset-0 bg-gray-10">
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
        <div className="flex w-full min-w-0 flex-col items-start justify-start gap-[0.4rem]">
          <div
            className="line-clamp-1 w-full break-words text-gray-90 t5"
            title={title}
          >
            {title}
          </div>
          <div
            className="line-clamp-1 w-full break-words text-gray-50 ct4"
            title={location}
          >
            {location}
          </div>
        </div>
      )}
    </button>
  );
}
