import MoreIcon from '@/assets/icons/card-more.svg?react';
import CalendarBox from '@/components/gallery/CalendarBox';
import IndicatorDots from '@/components/gallery/IndicatorDots';

interface Props {
  data: {
    imageUrl: string;
    title: string;
    subTitle: string;
    location: string;
    date?: string;
    month?: string;
  };
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick?: (index: number) => void;
}

export default function GalleryCardDetail({
  data,
  onPrev,
  onNext,
  currentIndex,
  total,
  onDotClick,
}: Props) {
  return (
    <div className="flex w-full max-w-[36rem] flex-col items-center gap-[5.6rem] px-[2.4rem]">
      <div className="relative w-full">
        <img
          className="h-[48.1rem] w-full rounded-2xl object-cover"
          src={data.imageUrl}
          alt={data.title}
        />

        <div className="absolute left-[2.5rem] top-[2.3rem]">
          <CalendarBox month={data.month} date={data.date} />
        </div>

        <div className="absolute bottom-0 left-0 w-full rounded-b-2xl bg-gradient-to-b from-sky-800/0 to-blue-500 px-[2.4rem] py-[2.4rem]">
          <div className="flex items-center justify-between text-gray-0">
            <div className="flex flex-col gap-[0.2rem]">
              <p className="text-bd2">{data.location}</p>
              <p className="text-t2 font-bold">{data.subTitle}</p>
            </div>
            <MoreIcon className="w-[2.4rem] cursor-pointer" />
          </div>
        </div>
      </div>

      <IndicatorDots
        count={total}
        activeIndex={currentIndex}
        onDotClick={onDotClick}
      />

      <div className="absolute bottom-[2.4rem] right-[2.4rem] flex gap-2">
        <button
          type="button"
          aria-label="이전"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 backdrop-blur-sm"
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          <span className="rotate-180">{'>'}</span>
        </button>
        <button
          type="button"
          aria-label="다음"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/50 backdrop-blur-sm"
          onClick={onNext}
          disabled={currentIndex === total - 1}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
}
