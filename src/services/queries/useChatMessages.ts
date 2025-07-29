import { useQuery } from '@tanstack/react-query';

import queryFactory from '@/services/queryFactory';
import type { ChatMessage } from '@/types';

const useChatMessages = (chatRoomId: number, enabled: boolean = true) => {
  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: queryFactory.chatMessages(chatRoomId),
    enabled,
    staleTime: 0,
    retry: false,
  });
};

export default useChatMessages;
