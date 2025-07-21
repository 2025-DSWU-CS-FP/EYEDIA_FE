import { useState, useEffect, useRef, useCallback } from 'react';

import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { BannerCarouselProps } from '@/types';

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1,
    );
  }, [banners.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  });

  // 터치 이벤트
  useEffect(() => {
    const slide = slideRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;

      if (
        touchStartX.current !== null &&
        touchEndX.current !== null &&
        Math.abs(touchStartX.current - touchEndX.current) > 50
      ) {
        if (touchStartX.current > touchEndX.current) {
          handleNext();
        } else {
          handlePrev();
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
    };

    if (slide) {
      slide.addEventListener('touchstart', handleTouchStart);
      slide.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (slide) {
        slide.removeEventListener('touchstart', handleTouchStart);
        slide.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleNext, handlePrev]);

  return (
    <div className="w-full overflow-hidden relative" ref={slideRef}>
      <div
        className="flex transition-all duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map(banner => (
          <div
            key={banner.id}
            className="w-full flex-shrink-0 h-[487px] bg-cover bg-center relative"
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          >
            <div className="absolute inset-0 flex flex-col justify-end px-4 pb-7 text-white bg-black bg-opacity-50">
              <span className="text-sm">{banner.subtitle}</span>
              <h2 className="text-xl font-semibold">{banner.title}</h2>
              <p className="text-sm">{banner.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, idx) => (
          <button
            type="button"
            key={banners[idx].id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`배너 ${idx + 1}번으로 이동`}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === idx ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="자세히 보기"
        className="absolute bottom-5 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/40 hover:bg-white/60 transition-all duration-300 group"
        onClick={() => navigate(`/exhibition/${banners[currentIndex].id}`)}
      >
        <ArrowRight
          className="text-white group-hover:translate-x-1 transition-transform duration-300"
          size={20}
        />
      </button>
    </div>
  );
}
