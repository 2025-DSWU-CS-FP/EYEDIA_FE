import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ExhibitionVisitDetail } from '@/types/exhibition';

export default function useExhibitionVisitDetail(
  exhibitionId: number,
  enabled = true,
) {
  return useQuery<ExhibitionVisitDetail>({
    queryKey: ['exhibitionVisitDetail', exhibitionId],
    queryFn: queryFactory.exhibitionVisitDetail(exhibitionId),
    enabled: enabled && Number.isFinite(exhibitionId),
    staleTime: 0,
    retry: false,
  });
}
