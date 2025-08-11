import { useMemo, useState } from 'react';

import { IoMedalOutline } from 'react-icons/io5';

import BadgeCard from '@/components/mypage/BadgeCard';
import Header from '@/layouts/Header';

type BadgeStatus = 'earned' | 'in_progress' | 'locked';
interface Badge {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  status: BadgeStatus;
  progress?: number;
  earnedAt?: string;
}

const TABS: { key: 'all' | BadgeStatus; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'earned', label: '획득' },
  { key: 'in_progress', label: '진행중' },
  { key: 'locked', label: '잠김' },
];

// 인덱스 대신 고정 키 사용 (규칙 만족)
const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'];

// TODO: API 연동 시 useQuery로 대체
const MOCK_BADGES: Badge[] = [
  {
    id: 'b1',
    title: '첫 수집',
    description: '첫 전시를 수집했어요',
    status: 'earned',
    earnedAt: '2025-08-10',
  },
  {
    id: 'b2',
    title: '연속 3일',
    description: '3일 연속 감상',
    status: 'in_progress',
    progress: 66,
  },
  {
    id: 'b3',
    title: '10개 수집',
    description: '전시 10개 수집',
    status: 'locked',
  },
  {
    id: 'b4',
    title: '첫 감상',
    description: '첫 작품 감상',
    status: 'earned',
    earnedAt: '2025-08-08',
  },
  {
    id: 'b5',
    title: '주말 큐레이터',
    description: '주말 2회 이상 방문',
    status: 'locked',
  },
];

function EmptyState() {
  return (
    <div className="col-span-2 flex flex-col items-center gap-[1.2rem] rounded-[8px] bg-white p-[2rem] text-center shadow-sm">
      <IoMedalOutline className="h-[3.2rem] w-[3.2rem] text-gray-40" />
      <p className="text-ct2 text-gray-80">아직 해당 뱃지가 없어요</p>
      <p className="text-ct4 text-gray-60">전시를 감상하거나 수집해 보세요.</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <>
      {SKELETON_KEYS.map(key => (
        <div
          key={key}
          className="animate-pulse h-[10rem] rounded-[8px] bg-gray-5"
        />
      ))}
    </>
  );
}

export default function MyBadgePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all');

  // API 예시:
  // const { data = [], isLoading } = useQuery<Badge[]>({ queryKey: ['badges'], queryFn: fetchBadges });
  const data = MOCK_BADGES;
  const isLoading = false;

  const earnedCount = data.filter(b => b.status === 'earned').length;
  const totalCount = data.length;

  const filtered = useMemo(() => {
    if (tab === 'all') return data;
    return data.filter(b => b.status === tab);
  }, [data, tab]);

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
              <p className="text-ct3 text-gray-60">획득한 뱃지</p>
              <p className="text-t3 text-gray-90">
                <span className="text-brand-mint">{earnedCount}</span> /{' '}
                {totalCount}
              </p>
            </div>
          </div>
          <p className="text-ct3 text-gray-60">
            다음 목표: <span className="text-gray-80">연속 3일</span>
          </p>
        </div>
      </section>

      {/* 필터 탭 */}
      <nav aria-label="뱃지 필터" className="px-[2.4rem]">
        <ul className="flex gap-[0.8rem]">
          {TABS.map(t => (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => setTab(t.key)}
                aria-pressed={tab === t.key}
                className={[
                  'rounded-[20px] px-[1.2rem] py-[0.6rem] text-ct3',
                  tab === t.key
                    ? 'bg-gray-90 text-white'
                    : 'bg-gray-10 text-gray-70 hover:bg-gray-20',
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
        {isLoading && <SkeletonGrid />}

        {!isLoading && filtered.length === 0 && <EmptyState />}

        {!isLoading &&
          filtered.length > 0 &&
          filtered.map(badge => <BadgeCard key={badge.id} badge={badge} />)}
      </section>
    </main>
  );
}
