import { IoChevronForward } from 'react-icons/io5';

import Logo from '@/assets/icons/main-title.svg?react';

interface ProfileCardProps {
  name: string;
  exhibitionCount: number;
}

export default function ProfileCard({
  name,
  exhibitionCount,
}: ProfileCardProps) {
  return (
    <div className="flex justify-between cursor-pointer bg-white items-center px-[3.7rem]">
      <div className="flex items-center gap-[2.4rem]">
        <Logo className="text-gray-50 w-[4rem]" />
        <div className="flex flex-col">
          <span className="text-gray-80 text-t3 font-semibold">{name}</span>
          <span className="text-gray-60 text-ct4 font-medium">
            현재 수집한 전시 {exhibitionCount}개
          </span>
        </div>
      </div>
      <IoChevronForward className="text-gray-80 text-t3" />
    </div>
  );
}
