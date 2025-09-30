import { useQuery } from '@tanstack/react-query';

import client from '@/services/axiosInstance';
import type { KeywordApiItem, TasteKeywordVM } from '@/types/recommendation';

function normalizeKeywordList(items: KeywordApiItem[]): TasteKeywordVM[] {
  return items.map(item => {
    if (typeof item === 'string') {
      return { id: item as unknown as TasteKeywordVM['id'], label: item };
    }
    return { id: item.code, label: item.koreanName };
  });
}

async function fetchTasteKeywords(): Promise<TasteKeywordVM[]> {
  const res = await client.get<{ keywords: KeywordApiItem[] }>(
    '/api/v1/recommendations/keywords',
  );
  const list = Array.isArray(res.data?.keywords) ? res.data.keywords : [];
  return normalizeKeywordList(list);
}

export default function useTasteKeywords() {
  return useQuery({
    queryKey: ['taste', 'keywords'],
    queryFn: fetchTasteKeywords,
  });
}
