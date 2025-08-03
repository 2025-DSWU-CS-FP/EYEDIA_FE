import { IoChevronForward } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import Logo from '@/assets/icons/main-title.svg?react';

interface ProfileCardProps {
  name: string;
  exhibitionCount: number;
}

export default function ProfileCard({
  name,
  exhibitionCount,
}: ProfileCardProps) {
  const navigate = useNavigate();
  return (
    <div className="flex cursor-pointer items-center justify-between bg-white px-[3.7rem]">
      <div className="flex items-center gap-[2.4rem]">
        <Logo className="w-[4rem] text-gray-50" />
        <div className="flex flex-col">
          <span className="text-t3 font-semibold text-gray-80">{name}</span>
          <span className="text-ct4 font-medium text-gray-60">
            현재 수집한 전시 {exhibitionCount}개
          </span>
        </div>
      </div>
      <IoChevronForward
        className="text-t3 text-gray-80"
        onClick={() => navigate('/mygallery')}
      />
    </div>
  );
}
