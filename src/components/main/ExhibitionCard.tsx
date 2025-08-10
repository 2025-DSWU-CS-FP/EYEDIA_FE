import { useState } from 'react';

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
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleClick = () => {
    navigate(`/gallery/${id}`);
  };

  const showSkeleton = isLoading ?? !imgLoaded;

  return (
    <button
      type="button"
      onClick={handleClick}
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
              // 이미지 크기 커스텀(className)을 유지
              imageClassName,
            )}
          >
            <span className="sr-only">이미지를 불러오는 중…</span>
          </div>
        )}

        {/* 작품 수 배지 */}
        {!showSkeleton && artworkCount !== undefined && (
          <span className="absolute bottom-[0.8rem] right-[0.8rem] rounded-[4px] bg-gray-0 px-[0.8rem] py-[0.4rem] text-ct4 text-gray-90">
            {artworkCount}개 작품
          </span>
        )}

        {/* 배지 자리표시자(스켈레톤) */}
        {showSkeleton && artworkCount !== undefined && (
          <span className="animate-pulse absolute bottom-[0.8rem] right-[0.8rem] h-[2.4rem] w-[6.8rem] rounded-[4px] bg-gray-20/80" />
        )}
      </div>

      {/* 텍스트 영역 */}
      {showSkeleton ? (
        <div className="flex w-full flex-col items-start justify-start gap-[0.4rem]">
          <div className="animate-pulse h-[2rem] w-3/4 rounded-[6px] bg-gray-20" />
          <div className="animate-pulse h-[1.6rem] w-1/2 rounded-[6px] bg-gray-20" />
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start gap-[0.4rem]">
          <div className="text-t5 text-gray-90">{title}</div>
          <div className="text-ct4 text-gray-50">{location}</div>
        </div>
      )}
    </button>
  );
}
