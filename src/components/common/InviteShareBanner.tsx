import { Link } from 'react-router-dom';

import Ticket from '@/assets/images/ticket.png';
import cn from '@/utils/cn';

interface InviteShareBannerProps {
  to: string;
  title: string;
  cta: string;
  className?: string;
}

export default function InviteShareBanner({
  to,
  title,
  cta,
  className,
}: InviteShareBannerProps) {
  return (
    <Link
      to={to}
      aria-label={`${title} ${cta}`}
      className={cn(
        'gradient-rotate gradient-dramatic shine relative flex h-[9.6rem] items-center justify-between gap-[1.3rem] rounded-[10px] bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 px-[2.4rem]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10',
        className,
      )}
    >
      <div className="flex flex-col justify-start gap-[0.4rem]">
        <p className="whitespace-nowrap text-left text-gray-800 bt3">{title}</p>
        <p className="text-left text-black t3">{cta}</p>
      </div>
      <img className="max-w-[8rem]" src={Ticket} alt="티켓 이미지" />
    </Link>
  );
}
