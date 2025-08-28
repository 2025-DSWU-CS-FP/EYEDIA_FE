import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { PopularExhibitionsPage } from '@/types/exhibition';

type Params = {
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: 'popular' | 'latest';
};

export default function usePopularExhibitions(params: Params, enabled = true) {
  const { keyword, page = 0, limit = 12, sort = 'popular' } = params ?? {};
  return useQuery<PopularExhibitionsPage>({
    queryKey: ['popularExhibitions', { keyword, page, limit, sort }],
    queryFn: queryFactory.popularExhibitions({ keyword, page, limit, sort }),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
