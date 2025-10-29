import { useState } from 'react';

import { FiMessageCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import MoreIcon from '@/assets/icons/card-more.svg?react';
import quoteIc from '@/assets/icons/quote.svg';
import BackCard from '@/assets/images/gallery-back-card.png';
import CalendarBox from '@/components/gallery/CalendarBox';

interface Props {
  data: {
    paintingId: number;
    imageUrl: string;
    title: string;
    subTitle: string;
    location: string;
    year?: string;
    month?: string;
    day?: string;
    tagline: string;
  };
}

export default function GalleryCardDetail({ data }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { year, month, day } = data;
  const navigate = useNavigate();
  const goChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/chat/${data.paintingId}`, {
      state: {
        paintingId: data.paintingId,
        title: data.title,
        author: data.subTitle,
        imageUrl: data.imageUrl,
      },
    });
  };
  return (
    <div className="flex w-full flex-col items-center gap-[5.6rem] px-[2.4rem]">
      <button
        type="button"
        aria-pressed={isFlipped}
        aria-label={isFlipped ? '카드 앞면 보기' : '카드 뒷면 보기'}
        className="relative h-[45rem] w-full py-[2.8rem] [perspective:1000px]"
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
              <CalendarBox year={year} month={month} day={day} />
            </div>
            <button
              type="button"
              onClick={goChat}
              aria-label="작품 대화로 이동"
              className="absolute right-[2.0rem] top-[2.0rem] rounded-full bg-black/35 p-[0.8rem] backdrop-blur hover:bg-black/45 focus:outline-none"
            >
              <FiMessageCircle className="h-[2.2rem] w-[2.2rem] text-white" />
            </button>

            <div className="absolute bottom-0 left-0 w-full rounded-b-2xl bg-gradient-to-b from-sky-800/0 to-blue-500 px-[2.4rem] py-[2.4rem] text-gray-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[0.2rem] text-left">
                  <p className="bd2">{data.location}</p>
                  <p className="font-bold t3">{data.title}</p>
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
              <span className="leading-relaxed t3">
                <span className="leading-relaxed t3">{data.tagline}</span>
              </span>
              <span className="ct1">- {data.subTitle}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
