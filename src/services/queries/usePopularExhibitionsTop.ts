import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { PopularExhibitionItem } from '@/types/exhibition';

export default function usePopularExhibitionsTop(size = 6, enabled = true) {
  return useQuery<PopularExhibitionItem[]>({
    queryKey: ['popularExhibitionsTop', size],
    queryFn: queryFactory.popularExhibitionsTop(size),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
