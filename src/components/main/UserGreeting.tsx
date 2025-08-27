import { Link } from 'react-router-dom';

import TitleImage from '@/assets/icons/main-title.svg?react';
import Ticket from '@/assets/images/ticket.png';
import { UserGreetingProps } from '@/types';

export default function UserGreeting({
  userName,
  viewCount,
}: UserGreetingProps) {
  return (
    <div className="flex flex-col gap-[2rem]">
      <div className="flex w-full items-center justify-between pr-[2.7rem]">
        <div className="inline-flex flex-col items-start justify-center gap-2">
          <div className="justify-start text-ct1 text-brand-mint">
            {userName}님
          </div>
          <div className="justify-start self-stretch text-t2 text-gray-90">
            이번 달 {viewCount}회 감상,
            <br />
            전시의 달인이시네요.
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TitleImage />
        </div>
      </div>
      <Link
        to="/card"
        className="gradient-rotate gradient-dramatic shine relative -ml-[0.5rem] mr-[2rem] flex h-[9.6rem] items-center justify-between gap-[1.3rem] rounded-[10px] bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 px-[2.4rem]"
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
  );
}
