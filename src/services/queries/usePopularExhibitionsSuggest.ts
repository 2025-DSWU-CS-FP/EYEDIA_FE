import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { PopularExhibitionItem } from '@/types/exhibition';

export default function usePopularExhibitionsSuggest(
  q: string | undefined,
  limit = 24,
  enabled = true,
) {
  const query = (q ?? '').trim();
  return useQuery<PopularExhibitionItem[]>({
    queryKey: ['popularExhibitionsSuggest', { q: query, limit }],
    queryFn: queryFactory.popularExhibitionsSuggest(query, limit),
    enabled: enabled && query.length > 0,
    staleTime: 60_000,
    retry: false,
  });
}
