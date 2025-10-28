import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';

export default function useVisitedCount() {
  return useQuery({
    queryKey: ['visitedCount'],
    queryFn: queryFactory.visitedCount(),
    staleTime: 5 * 60 * 1000,
  });
}
