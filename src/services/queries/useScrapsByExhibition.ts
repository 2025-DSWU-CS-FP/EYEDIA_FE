import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ScrapItem } from '@/types/scrap';

const toTime = (d?: string) => (d ? new Date(d).getTime() : 0);

export default function useScrapsByExhibition(
  options: { enabled?: boolean } = {},
) {
  return useQuery<ScrapItem[]>({
    queryKey: ['scrapsByExhibition'],
    queryFn: queryFactory.scrapsByExhibition(),
    enabled: options.enabled ?? true,
    select: rows => [...rows].sort((a, b) => toTime(b.date) - toTime(a.date)),
  });
}
