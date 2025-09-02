import type { MyBadgesResult, BadgeItem } from '@/types/badge';
import type { UIBadge } from '@/types/badge-ui';

const STATUS_MAP: Record<BadgeItem['status'], UIBadge['status']> = {
  ACHIEVED: 'earned',
  IN_PROGRESS: 'in_progress',
  LOCKED: 'locked',
};

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

export default function mapMyBadgesToUI(data: MyBadgesResult): UIBadge[] {
  return data.badges.map(b => ({
    id: b.code,
    title: b.title,
    description: b.description,
    status: STATUS_MAP[b.status],
    progress: toProgress(b),
    earnedAt: b.awardedAt,
    iconUrl: undefined,
  }));
}
