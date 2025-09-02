import type { MyBadgesResult, BadgeItem } from '@/types/badge';
import type { UIBadge } from '@/types/badge-ui';

const STATUS_MAP: Record<BadgeItem['status'], UIBadge['status']> = {
  ACHIEVED: 'earned',
  IN_PROGRESS: 'in_progress',
  LOCKED: 'locked',
};

const OPEN_RE = /^badge\.app\.open\.(\d+)$/;
const STREAK_RE = /^badge\.app\.streak\.(\d+)$/;

function prettyTitleFromCode(code: string, fallback: string): string {
  const mOpen = OPEN_RE.exec(code);
  if (mOpen) return `접속 ${Number(mOpen[1])}회`;

  const mStreak = STREAK_RE.exec(code);
  if (mStreak) return `${Number(mStreak[1])}일 연속 접속`;

  return fallback;
}

function formatKST(dateISO: string): string {
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

function prettyDescription(b: BadgeItem): string {
  if (b.status === 'ACHIEVED') {
    return b.awardedAt ? `${formatKST(b.awardedAt)} 획득` : '획득 완료';
  }
  if (b.status === 'IN_PROGRESS') {
    if (b.goalValue > 0) return `${b.currentValue}/${b.goalValue} 진행 중`;
    return '진행 중';
  }
  const mOpen = OPEN_RE.exec(b.code);
  if (mOpen) return `앱을 ${Number(mOpen[1])}번 열면 획득`;

  const mStreak = STREAK_RE.exec(b.code);
  if (mStreak) return `${Number(mStreak[1])}일 연속 접속하면 획득`;

  return '달성 조건을 완료하면 획득';
}

function clamp(v: number, min: number, max: number): number {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function toProgress(b: BadgeItem): number | undefined {
  if (b.status === 'ACHIEVED') return 100;
  if (b.goalValue > 0) {
    const p = Math.round((b.currentValue / b.goalValue) * 100);
    return clamp(p, 0, 100);
  }
  return undefined;
}

export function formatBadgeTitleFromItem(item?: BadgeItem): string {
  if (!item) return '다음 목표 없음';
  return prettyTitleFromCode(item.code, item.title);
}

export default function mapMyBadgesToUI(data: MyBadgesResult): UIBadge[] {
  return data.badges.map(b => ({
    id: b.code,
    title: prettyTitleFromCode(b.code, b.title),
    description: prettyDescription(b),
    status: STATUS_MAP[b.status],
    progress: toProgress(b),
    earnedAt: b.awardedAt,
    iconUrl: undefined,
  }));
}
