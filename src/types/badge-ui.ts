export type UIBadgeStatus = 'earned' | 'in_progress' | 'locked';

export interface UIBadge {
  id: string;
  title: string;
  description: string;
  status: UIBadgeStatus;
  progress?: number;
  earnedAt?: string | null;
  iconUrl?: string;
}
