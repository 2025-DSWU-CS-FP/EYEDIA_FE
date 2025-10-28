import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ScrapItem } from '@/types/scrap';

export default function useScrapsByExhibition(
  options: { enabled?: boolean } = {},
) {
  return useQuery<ScrapItem[]>({
    queryKey: ['scrapsByExhibition'],
    queryFn: queryFactory.scrapsByExhibition(),
    enabled: options.enabled ?? true,
  });
}
