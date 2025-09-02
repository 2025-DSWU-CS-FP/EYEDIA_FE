export type BadgeStatus = 'LOCKED' | 'IN_PROGRESS' | 'ACHIEVED';

export interface BadgeItem {
  code: string;
  title: string;
  description: string;
  status: BadgeStatus;
  awardedAt: string | null;
  goalValue: number;
  currentValue: number;
  newBadge: boolean;
}

export interface MyBadgesResult {
  acquired: number;
  total: number;
  nextTarget?: BadgeItem;
  badges: BadgeItem[];
}

export type BadgeEventType = 'EXHIBITION_COLLECTED' | 'APP_OPENED';

export interface BadgeEventRequest {
  eventUid: string;
  type: BadgeEventType;
  occurredAt: string;
  payload: {
    exhibitionId?: number;
    timezone?: string;
  };
}
