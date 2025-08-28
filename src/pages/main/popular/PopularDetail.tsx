import { Link } from 'react-router-dom';

import Ticket from '@/assets/images/ticket.png';
import PopularInfoCard from '@/components/main/PopularInfoCard';
import Header from '@/layouts/Header';
import { exhibitionInfo } from '@/mock/galleryDetailData';

export default function PopularDetailPage() {
  return (
    <div className="pb-[4rem]">
      <Header
        title="인기 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <div className="flex flex-col gap-[4rem]">
        <div className="px-[2.4rem]">
          <PopularInfoCard
            thumbnail={exhibitionInfo.thumbnail}
            title={exhibitionInfo.title}
            location={exhibitionInfo.location}
          />
        </div>
        <img
          alt="인기 전시 상세 이미지"
          src={exhibitionInfo.thumbnail}
          className="px-[2.4rem]"
        />
        <Link
          to="/card"
          className="gradient-rotate gradient-dramatic shine relative mx-[2rem] flex h-[9.6rem] items-center justify-between gap-[1.3rem] rounded-[10px] bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 px-[2.4rem]"
        >
          <div className="flex flex-col justify-start gap-[0.4rem]">
            <div className="whitespace-nowrap text-left text-gray-800 bt3">
              친구와 함께 전시를 관람하고 싶다면?
            </div>
            <div className="text-left text-black t3">Eyedia 공유하기 →</div>
          </div>
          <img className="max-w-[8rem]" src={Ticket} alt="티켓이미지" />
        </Link>
      </div>
    </div>
  );
}
