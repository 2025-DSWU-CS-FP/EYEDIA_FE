import TitleImage from '@/assets/icons/main-title.svg?react';
import { UserGreetingProps } from '@/types';

export default function UserGreeting({
  userName,
  viewCount,
}: UserGreetingProps) {
  return (
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
  );
}
