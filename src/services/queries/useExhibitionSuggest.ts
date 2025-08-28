import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ExhibitionSuggestItem } from '@/types/exhibition';

export default function useExhibitionSuggest(
  q: string,
  limit = 10,
  enabled = true,
) {
  return useQuery<ExhibitionSuggestItem[]>({
    queryKey: ['exhibitionSuggest', q, limit],
    queryFn: queryFactory.exhibitionSuggest(q, limit),
    enabled: enabled && q.trim().length > 0,
    staleTime: 60_000,
    retry: false,
  });
}
