import { useMemo } from 'react';

import TitleImage from '@/assets/icons/main-title.svg?react';
import InviteShareBanner from '@/components/common/InviteShareBanner';
import { getPraiseMessage } from '@/constants/userGreetingLevels';
import { UserGreetingProps } from '@/types';

export default function UserGreeting({
  userName,
  viewCount,
}: UserGreetingProps) {
  const safeCount =
    Number.isFinite(viewCount) && viewCount >= 0 ? viewCount : 0;

  const praise = useMemo(() => getPraiseMessage(safeCount), [safeCount]);

  return (
    <div className="flex flex-col gap-[2rem]">
      <div className="flex w-full items-center justify-between pr-[2.7rem]">
        <div className="inline-flex flex-col items-start justify-center gap-2">
          <div className="justify-start text-brand-mint ct1">
            {userName || '사용자'}님
          </div>
          <div className="justify-start self-stretch text-gray-90 t2">
            이번 달 {safeCount}회 감상,
            <br />
            {praise}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TitleImage />
        </div>
      </div>

      <InviteShareBanner
        to="/card"
        title="친구와 함께 전시를 관람하고 싶다면?"
        cta="Eyedia 공유하기 →"
        className="-ml-[0.5rem] mr-[2rem]"
      />
    </div>
  );
}
