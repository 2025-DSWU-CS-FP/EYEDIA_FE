import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ScrapItem } from '@/types/scrap';

export default function useScrapsByExhibition(
  userId: number,
  location: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery<ScrapItem[]>({
    queryKey: ['scrapsByExhibition', userId, location],
    queryFn: queryFactory.scrapsByExhibition(userId, location),
    enabled: options.enabled ?? true,
  });
}
