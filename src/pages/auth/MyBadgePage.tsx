import { useMemo, useState } from 'react';

import { IoMedalOutline } from 'react-icons/io5';

import BadgeCard from '@/components/mypage/BadgeCard';
import Header from '@/layouts/Header';
import useMyBadges from '@/services/queries/useMyBadges';
import type { UIBadge, UIBadgeStatus } from '@/types';
import mapMyBadgesToUI from '@/types/badgeMapper';

type TabKey = 'all' | UIBadgeStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'earned', label: '획득' },
  { key: 'in_progress', label: '진행중' },
  { key: 'locked', label: '잠김' },
];

const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'];

function EmptyState() {
  return (
    <div className="col-span-2 flex flex-col items-center gap-[1.2rem] rounded-[8px] bg-white p-[2rem] text-center shadow-sm">
      <IoMedalOutline className="h-[3.2rem] w-[3.2rem] text-gray-40" />
      <p className="text-gray-80 ct2">아직 해당 뱃지가 없어요</p>
      <p className="text-gray-60 ct4">전시를 감상하거나 수집해 보세요.</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <>
      {SKELETON_KEYS.map(k => (
        <div
          key={k}
          className="animate-pulse h-[10rem] rounded-[8px] bg-gray-5"
        />
      ))}
    </>
  );
}

export default function MyBadgePage() {
  const [tab, setTab] = useState<TabKey>('all');

  type ApiStatus = 'ACHIEVED' | 'IN_PROGRESS' | 'LOCKED';

  const TAB_TO_API = {
    all: undefined,
    earned: 'ACHIEVED',
    in_progress: 'IN_PROGRESS',
    locked: 'LOCKED',
  } as const satisfies Record<TabKey, ApiStatus | undefined>;

  const apiStatus: ApiStatus | undefined = TAB_TO_API[tab];

  const { data, isFetching, isError } = useMyBadges(apiStatus);

  const uiBadges: UIBadge[] = useMemo(
    () => (data ? mapMyBadgesToUI(data) : []),
    [data],
  );
  const earnedCount = data?.acquired ?? 0;
  const totalCount = data?.total ?? 0;
  const nextTargetTitle = data?.nextTarget?.title ?? '다음 목표 없음';

  const filtered = useMemo(() => uiBadges, [uiBadges]);

  return (
    <main className="flex w-full flex-col">
      <Header
        title="나의 뱃지"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <section className="px-[2.4rem] py-[2rem]">
        <div className="flex items-center justify-between rounded-[8px] bg-white p-[1.6rem] shadow-sm">
          <div className="flex items-center gap-[1.2rem]">
            <div className="flex h-[4rem] w-[4rem] items-center justify-center rounded-[8px] bg-brand-mint/10">
              <IoMedalOutline className="h-[2.4rem] w-[2.4rem] text-brand-mint" />
            </div>
            <div className="flex flex-col">
              <p className="text-gray-60 ct3">획득한 뱃지</p>
              <p className="text-gray-90 t3">
                <span className="text-brand-mint">{earnedCount}</span> /{' '}
                {totalCount}
              </p>
            </div>
          </div>
          <p className="text-gray-60 ct3">
            다음 목표: <span className="text-gray-80">{nextTargetTitle}</span>
          </p>
        </div>
      </section>

      <nav aria-label="뱃지 필터" className="px-[2.4rem]">
        <ul className="flex gap-[0.8rem]">
          {TABS.map(t => (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => setTab(t.key)}
                aria-pressed={tab === t.key}
                className={[
                  'rounded-[6px] px-[1.2rem] py-[0.6rem] ct3',
                  tab === t.key
                    ? 'bg-gray-90 text-white'
                    : 'bg-gray-10 text-gray-70 hover:bg-gray-20/50',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-mint',
                ].join(' ')}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section className="mt-[1.6rem] grid grid-cols-2 gap-[0.8rem] px-[2.4rem] pb-[4rem]">
        {isFetching && <SkeletonGrid />}
        {!isFetching && !isError && filtered.length === 0 && <EmptyState />}
        {!isFetching &&
          !isError &&
          filtered.length > 0 &&
          filtered.map(b => <BadgeCard key={b.id} badge={b} />)}
        {!isFetching && isError && (
          <div className="col-span-2 rounded-[8px] bg-white p-[1.6rem] text-center text-red-500 shadow-sm ct3">
            뱃지를 불러오지 못했어요.
          </div>
        )}
      </section>
    </main>
  );
}
