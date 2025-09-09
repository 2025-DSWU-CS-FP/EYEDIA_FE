import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { BadgeStatus, MyBadgesResult } from '@/types/badge';

export default function useMyBadges(
  status?: BadgeStatus,
  options: { enabled?: boolean } = {},
) {
  return useQuery<MyBadgesResult>({
    queryKey: ['myBadges', status ?? 'ALL'],
    queryFn: queryFactory.myBadges(status),
    enabled: options.enabled ?? true,
  });
}
