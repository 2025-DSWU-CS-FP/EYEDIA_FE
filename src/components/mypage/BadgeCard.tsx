import {
  IoLockClosed,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoRibbon,
} from 'react-icons/io5';

import type { Badge } from '@/types/badge';

interface Props {
  badge: Badge;
  onClick?: (badge: Badge) => void; // 디테일 시트 열기 등 확장 대비
}

export default function BadgeCard({ badge, onClick }: Props) {
  const { title, description, status, progress = 0, iconUrl } = badge;

  const statusChip = {
    earned: { label: '획득', className: 'bg-brand-mint/10 text-brand-mint' },
    in_progress: { label: '진행중', className: 'bg-blue-500/10 text-blue-500' },
    locked: { label: '잠김', className: 'bg-gray-10 text-gray-60' },
  }[status];

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(badge)}
      onKeyDown={e => e.key === 'Enter' && onClick?.(badge)}
      className={[
        'flex flex-col gap-[0.8rem] rounded-[8px] p-[1.2rem] outline-none',
        'bg-white shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-mint',
        status === 'locked' ? 'opacity-70' : 'opacity-100',
      ].join(' ')}
      aria-label={`${title} 뱃지`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[1.2rem]">
          <div className="flex h-[4rem] w-[4rem] items-center justify-center overflow-hidden rounded-[8px] bg-gray-5">
            {iconUrl ? (
              <img
                src={iconUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <IoRibbon className="h-[2.4rem] w-[2.4rem] text-gray-50" />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-t4 text-gray-90">{title}</h3>
            <p className="text-ct4 text-gray-60">{description}</p>
          </div>
        </div>
        <span
          className={`rounded-[6px] px-[0.8rem] py-[0.4rem] text-ct5 font-semibold ${statusChip.className}`}
        >
          {statusChip.label}
        </span>
      </div>

      {/* 진행도 바 (in_progress일 때만) */}
      {status === 'in_progress' && (
        <div
          className="flex flex-col gap-[0.4rem]"
          style={{ ['--p' as any]: `${progress}%` }}
        >
          <div className="h-[0.8rem] w-full rounded-[6px] bg-gray-10">
            <div className="h-full w-[var(--p)] rounded-[6px] bg-blue-500" />
          </div>
          <div className="flex items-center justify-end gap-[0.6rem] text-ct5 text-gray-60">
            <IoTimeOutline className="h-[1.6rem] w-[1.6rem]" />
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {/* 획득 아이콘 (earned) / 잠김 아이콘 (locked) */}
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
