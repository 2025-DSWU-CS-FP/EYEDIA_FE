export type BadgeStatus = 'earned' | 'in_progress' | 'locked';

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  status: BadgeStatus;
  progress?: number;
  earnedAt?: string;
}
