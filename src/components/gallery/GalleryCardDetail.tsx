import { useState } from 'react';

import MoreIcon from '@/assets/icons/card-more.svg?react';
import quoteIc from '@/assets/icons/quote.svg';
import BackCard from '@/assets/images/gallery-back-card.png';
import CalendarBox from '@/components/gallery/CalendarBox';

interface Props {
  data: {
    imageUrl: string;
    title: string;
    subTitle: string;
    location: string;
    date?: string;
    month?: string;
  };
}

export default function GalleryCardDetail({ data }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex w-full max-w-[36rem] flex-col items-center gap-[5.6rem] px-[2.4rem] pb-[3rem]">
      <button
        type="button"
        className="relative h-[48.1rem] w-full [perspective:1000px]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="inline-grid h-full w-full rounded-2xl transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div
            className="absolute h-full w-full rounded-2xl [backface-visibility:hidden]"
            style={{ transform: 'rotateY(0deg)' }}
          >
            <img
              className="h-full w-full rounded-2xl object-cover"
              src={data.imageUrl}
              alt={data.title}
            />

            <div className="absolute left-[2.5rem] top-[2.3rem]">
              <CalendarBox month={data.month} date={data.date} />
            </div>

            <div className="absolute bottom-0 left-0 w-full rounded-b-2xl bg-gradient-to-b from-sky-800/0 to-blue-500 px-[2.4rem] py-[2.4rem] text-gray-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[0.2rem] text-left">
                  <p className="text-bd2">{data.location}</p>
                  <p className="text-t2 font-bold">{data.subTitle}</p>
                </div>
                <MoreIcon className="w-[2.4rem]" />
              </div>
            </div>
          </div>

          <div
            className="absolute h-full w-full rounded-2xl [backface-visibility:hidden]"
            style={{
              transform: 'rotateY(180deg)',
              backgroundImage: `url(${BackCard})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-[1.6rem] px-[3.5rem] text-[#347EB5]">
              <img src={quoteIc} alt="quote" className="w-[3.2rem]" />
              <span className="text-t3 leading-relaxed">
                수영하는 풍경, 그곳을 보고 나는 떠나기로 결심했다.
              </span>
              <span className="text-ct1">- 요시고</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
