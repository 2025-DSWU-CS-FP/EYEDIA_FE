import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ExhibitionPopularDetail } from '@/types/exhibition';

export default function usePopularExhibitionDetail(
  exhibitionId: number,
  enabled = true,
) {
  return useQuery<ExhibitionPopularDetail>({
    queryKey: ['popularExhibitionDetail', exhibitionId],
    queryFn: queryFactory.popularExhibitionDetail(exhibitionId),
    enabled: enabled && Number.isFinite(exhibitionId),
    staleTime: 60_000,
    retry: false,
  });
}
