import { useQuery } from '@tanstack/react-query';

import client from '@/services/axiosInstance';
import type { ExhibitionRecItem } from '@/types/recommendation';

type GroupedResponseItem = {
  keyword: string | { koreanName?: string; code?: string };
  exhibitions: Array<{
    id: number | string;
    title: string;
    artist: string;
    location: string;
    thumbnailUrl: string;
  }>;
};

function normalizeKeyword(k: GroupedResponseItem['keyword']): string {
  return typeof k === 'string' ? k : (k.code ?? k.koreanName ?? '');
}

async function fetchExhibitionsByKeyword(
  keyword: string,
): Promise<ExhibitionRecItem[]> {
  const res = await client.get<GroupedResponseItem[]>(
    '/api/v1/recommendations/exhibitions',
  );

  const data = Array.isArray(res.data) ? res.data : [];
  const found = data.find(g => normalizeKeyword(g.keyword) === keyword);

  const exhibitions = found?.exhibitions ?? [];
  return exhibitions.map(it => ({
    id: it.id,
    title: it.title,
    artist: it.artist,
    location: it.location,
    thumbnailUrl: it.thumbnailUrl,
  }));
}

export default function useRecommendExhibitions(keyword: string | null) {
  return useQuery({
    queryKey: ['taste', 'exhibitions', keyword],
    queryFn: () => {
      if (!keyword) {
        throw new Error('keyword is required');
      }
      return fetchExhibitionsByKeyword(keyword);
    },
    enabled: Boolean(keyword),
  });
}
