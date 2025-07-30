import TitleImage from '@/assets/icons/main-title.svg?react';

interface UserGreetingProps {
  userName: string;
  viewCount: number;
}

export default function UserGreeting({
  userName,
  viewCount,
}: UserGreetingProps) {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="inline-flex flex-col justify-center items-start gap-2">
        <div className="justify-start text-brand-mint text-ct1">
          {userName}님
        </div>
        <div className="self-stretch justify-start text-gray-90 text-t2">
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
