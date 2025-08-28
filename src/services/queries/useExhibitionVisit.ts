import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ExhibitionVisitRecentPage } from '@/types/exhibition';

type VisitParams = {
  keyword?: string;
  isBookmarked?: boolean;
  sort?: 'RECENT' | 'DATE';
  page?: number;
  limit?: number;
};

export default function useExhibitionVisit(
  params: VisitParams,
  enabled = true,
) {
  return useQuery<ExhibitionVisitRecentPage>({
    queryKey: ['exhibitionVisitRecent', params],
    queryFn: queryFactory.exhibitionVisitRecent(params),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
