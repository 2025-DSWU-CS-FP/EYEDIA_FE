import axiosInstance from '@/services/axiosInstance';
import type { ChatMessage } from '@/types';

const queryFactory = {
  chatMessages: (chatRoomId: number) => async (): Promise<ChatMessage[]> => {
    const res = await axiosInstance.get(
      `/api/v1/paintings/${chatRoomId}/chats`,
    );
    return res.data;
  },
};

export default queryFactory;
