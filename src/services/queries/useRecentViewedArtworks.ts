import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { RecentViewedPage } from '@/types/scrap';

export default function useRecentViewedArtworks(
  params: { page?: number; limit?: number; sort?: 'recent' } = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery<RecentViewedPage>({
    queryKey: [
      'recentViewedArtworks',
      params.page ?? 0,
      params.limit ?? 10,
      params.sort ?? 'recent',
    ],
    queryFn: queryFactory.recentViewedArtworks(params),
    enabled: options.enabled ?? true,
  });
}
