import { IoChevronForward } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import Logo from '@/assets/icons/main-title.svg?react';
import useVisitedCount from '@/services/queries/useVisitedCount';

interface ProfileCardProps {
  name: string;
  exhibitionCount?: number;
}

export default function ProfileCard({
  name,
  exhibitionCount,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { data } = useVisitedCount();

  let count = 0;
  if (typeof data === 'number') {
    count = data;
  } else if (typeof exhibitionCount === 'number') {
    count = exhibitionCount;
  }

  const subtitle = `현재 수집한 전시 ${count}개`;

  return (
    <button
      type="button"
      onClick={() => navigate('/mygallery')}
      className="flex cursor-pointer items-center justify-between bg-white px-[3.7rem] text-left"
    >
      <div className="flex items-center gap-[2.4rem]">
        <Logo className="w-[4rem] text-gray-50" />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-80 t3">{name}</span>
          <span className="font-medium text-gray-60 ct4">{subtitle}</span>
        </div>
      </div>
      <IoChevronForward className="text-gray-80 t3" />
    </button>
  );
}
