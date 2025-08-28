import { useQuery } from '@tanstack/react-query';

import type { ExhibitionPopularDetail } from '@/types/exhibition';

import queryFactory from '../queryFactory';

export default function usePopularExhibitionDetail(
  exhibitionId?: number,
  enabled = true,
) {
  const isValid =
    typeof exhibitionId === 'number' && Number.isFinite(exhibitionId);

  const queryFn: () => Promise<ExhibitionPopularDetail> = isValid
    ? queryFactory.popularExhibitionDetail(exhibitionId)
    : async () => {
        throw new Error('Exhibition ID is not set');
      };

  return useQuery<ExhibitionPopularDetail>({
    queryKey: ['popularExhibitionDetail', exhibitionId],
    queryFn,
    enabled: enabled && isValid,
    staleTime: 60_000,
  });
}
