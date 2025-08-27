import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ExhibitionVisitRecentPage } from '@/types/exhibition';

export default function useExhibitionVisit(
  page = 0,
  limit = 12,
  enabled = true,
) {
  return useQuery<ExhibitionVisitRecentPage>({
    queryKey: ['exhibitionVisitRecent', page, limit],
    queryFn: queryFactory.exhibitionVisitRecent(page, limit),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
