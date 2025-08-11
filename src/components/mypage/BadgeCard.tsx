import { IoLockClosed, IoCheckmarkCircle, IoRibbon } from 'react-icons/io5';

import type { Badge } from '@/types';

interface Props {
  badge: Badge;
}

export default function BadgeCard({ badge }: Props) {
  const { title, description, status, progress = 0, iconUrl } = badge;

  const statusChip = {
    earned: { label: '획득', className: 'bg-brand-mint/10 text-brand-mint' },
    in_progress: { label: '진행', className: 'bg-blue-500/10 text-blue-500' },
    locked: { label: '잠김', className: 'bg-gray-10 text-gray-60' },
  }[status];

  type ProgressStyle = React.CSSProperties & { '--p': string };
  const progressStyle: ProgressStyle = { '--p': `${progress}%` };

  return (
    <article
      className={[
        'relative',
        'flex min-h-[10rem] flex-col gap-[1rem] rounded-[8px] px-[1.3rem] pb-[1.2rem] pt-[1.8rem] outline-none',
        'bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-brand-mint',
        status === 'locked' ? 'opacity-70' : 'opacity-100',
      ].join(' ')}
      aria-label={`${title} 뱃지`}
    >
      <span
        className={[
          'pointer-events-none',
          'absolute right-[1rem] top-[1rem]',
          'rounded-[6px] px-[0.5rem] py-[0.3rem] text-ct6 font-semibold',
          statusChip.className,
        ].join(' ')}
      >
        {statusChip.label}
      </span>

      <div className="flex items-center justify-start">
        <div className="flex items-center gap-[0.6rem]">
          <div className="flex h-[3rem] w-[3rem] items-center justify-center overflow-hidden rounded-[8px] bg-gray-5">
            {iconUrl ? (
              <img
                src={iconUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <IoRibbon className="h-[2rem] w-[2rem] text-gray-50" />
            )}
          </div>
          <div className="flex flex-col gap-[0.4rem]">
            <h3 className="text-ct3 text-gray-90">{title}</h3>
            <p className="text-ct5 text-gray-60">{description}</p>
          </div>
        </div>
      </div>

      {status === 'in_progress' && (
        <div className="flex flex-col gap-[0.4rem]" style={progressStyle}>
          <div className="h-[0.8rem] w-full rounded-[6px] bg-gray-10">
            <div className="h-full w-[var(--p)] rounded-[6px] bg-blue-500" />
          </div>
        </div>
      )}

      {status !== 'in_progress' && (
        <div className="flex items-center justify-end">
          {status === 'earned' ? (
            <IoCheckmarkCircle
              className="h-[2rem] w-[2rem] text-brand-mint"
              aria-label="획득 완료"
            />
          ) : (
            <IoLockClosed
              className="h-[2rem] w-[2rem] text-gray-40"
              aria-label="잠김"
            />
          )}
        </div>
      )}
    </article>
  );
}
