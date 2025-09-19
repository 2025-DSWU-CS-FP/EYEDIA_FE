import { useQuery } from '@tanstack/react-query';

import client from '@/services/axiosInstance';
import type { ExhibitionRecItem } from '@/types/recommendation';

type GroupedResponseItem = {
  keyword: { koreanName: string; code: string };
  exhibitions: Array<{
    id: number | string;
    title: string;
    artist: string;
    location: string;
    thumbnailUrl: string;
  }>;
};

async function fetchExhibitionsByKeyword(
  keyword: string,
): Promise<ExhibitionRecItem[]> {
  const res = await client.get<GroupedResponseItem[]>(
    '/api/v1/recommendations/exhibitions',
    { params: { keyword } },
  );

  const data = Array.isArray(res.data) ? res.data : [];
  const found = data.find(
    g => g?.keyword?.code === keyword || g?.keyword?.koreanName === keyword,
  );
  const exhibitions =
    found?.exhibitions ?? (data as unknown as ExhibitionRecItem[]);

  return (exhibitions ?? []).map(it => ({
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
    queryFn: () => fetchExhibitionsByKeyword(keyword as string),
    enabled: Boolean(keyword),
  });
}
