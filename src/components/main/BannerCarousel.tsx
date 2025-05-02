import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ArrowRight } from 'lucide-react';

interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  date: string;
}

interface BannerCarouselProps {
  banners: BannerItem[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentBanner = banners[currentIndex];

  return (
    <div className="w-full overflow-hidden relative">
      <div
        key={currentBanner.id}
        className="relative w-full h-[487px] bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
      >
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-7 text-white bg-black bg-opacity-50">
          <span className="text-sm">{currentBanner.subtitle}</span>
          <h2 className="text-xl font-semibold">{currentBanner.title}</h2>
          <p className="text-sm">{currentBanner.date}</p>
        </div>
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
        onClick={() => navigate('/exhibition/1')}
      >
        <ArrowRight
          className="text-white group-hover:translate-x-1 transition-transform duration-300"
          size={20}
        />
      </button>
    </div>
  );
}
