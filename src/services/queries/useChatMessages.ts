import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ChatMessage } from '@/types';

export default function useChatMessages(paintingId: number) {
  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', paintingId],
    queryFn: queryFactory.chatMessages(paintingId),
    enabled: Number.isFinite(paintingId) && paintingId > 0,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}
