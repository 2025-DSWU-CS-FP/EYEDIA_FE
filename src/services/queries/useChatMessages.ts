import { useQuery } from '@tanstack/react-query';

import axiosInstance from '@/services/axiosInstance';

interface ChatMessage {
  sender: 'ASSISTANT' | 'USER';
  content: string;
  paintingId: number;
  chatType: string | null;
  timestamp: string;
}

const useChatMessages = (chatRoomId: number, enabled: boolean = true) => {
  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/v1/paintings/${chatRoomId}/chats`,
      );
      return res.data;
    },
    enabled,
    staleTime: 0,
    retry: false,
  });
};

export default useChatMessages;
