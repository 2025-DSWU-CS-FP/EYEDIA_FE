import { useState } from 'react';

interface ExhibitionCardProps {
  imageUrl: string;
  title?: string;
  subTitle: string;
  showArrow?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  /** 외부에서 로딩 제어(데이터 페칭 중) */
  isLoading?: boolean;
}

export default function ExhibitionCard({
  imageUrl,
  title,
  subTitle,
  showArrow,
  onClick,
  isSelected,
  isLoading,
}: ExhibitionCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  // 외부 로딩 신호(isLoading)가 우선, 없으면 이미지 로딩 상태로 판단
  const showSkeleton = isLoading ?? !imgLoaded;
  const hasOverlayContent = Boolean(title || showArrow);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={showSkeleton}
      aria-busy={showSkeleton}
      aria-live="polite"
      className={`group relative aspect-[3/4] overflow-hidden rounded-[10px] transition-transform duration-200 ease-in-out ${showSkeleton ? 'cursor-default' : 'cursor-pointer'} `}
    >
      {/* 이미지 */}
      <img
        src={imageUrl}
        alt={title ?? '작품 이미지'}
        loading="lazy"
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          showSkeleton ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 스켈레톤 */}
      {showSkeleton && (
        <div className="absolute inset-0">
          <div className="animate-pulse h-full w-full bg-gray-10" />
          {/* 텍스트 영역 자리표시자 */}
          {hasOverlayContent && (
            <div className="absolute inset-0 flex h-full flex-col justify-between p-[2rem]">
              {/* 상단 타이틀 블록 */}
              <div className="h-[2.4rem] w-1/2 rounded-[6px] bg-gray-20" />
              {/* 하단 서브타이틀/화살표 영역 */}
              <div className="space-y-[0.8rem]">
                <div className="h-[1.8rem] w-3/4 rounded-[6px] bg-gray-20" />
                {showArrow && (
                  <div className="h-[1.6rem] w-[6rem] rounded-[6px] bg-gray-20" />
                )}
              </div>
              <span className="sr-only">콘텐츠를 불러오는 중…</span>
            </div>
          )}
        </div>
      )}

      {/* 오버레이(제목/부제) */}
      {hasOverlayContent && (
        <div
          className={`absolute inset-0 transition-colors duration-200 ease-in-out ${
            isSelected
              ? 'bg-gray-900/40'
              : 'bg-black/0 group-hover:bg-gray-100/40'
          } ${showSkeleton ? 'pointer-events-none opacity-0' : 'opacity-100'} `}
        >
          <div className="flex h-full flex-col justify-between p-[2rem] text-left opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
            <p className="text-ct1 text-gray-0">{title}</p>
            {showArrow && (
              <p className="text-ct3 font-bold text-gray-0">{subTitle}</p>
            )}
          </div>
        </div>
      )}
    </button>
  );
}
