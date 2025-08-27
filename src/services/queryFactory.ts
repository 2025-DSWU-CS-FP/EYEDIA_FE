import axiosInstance from '@/services/axiosInstance';
import type { ChatMessage } from '@/types';
import type {
  ExhibitionSuggestItem,
  ExhibitionVisitDetail,
  ExhibitionPopularDetail,
} from '@/types/exhibition';

const queryFactory = {
  chatMessages: (chatRoomId: number) => async (): Promise<ChatMessage[]> => {
    const res = await axiosInstance.get(
      `/api/v1/paintings/${chatRoomId}/chats`,
    );
    return res.data;
  },

  // 전시 검색
  exhibitionSuggest:
    (q: string, limit = 10) =>
    async (): Promise<ExhibitionSuggestItem[]> => {
      const res = await axiosInstance.get('/api/v1/exhibitions/suggest', {
        params: { q, limit },
      });
      return res.data.result;
    },

  // 내가 방문한 전시 상세
  exhibitionVisitDetail:
    (exhibitionId: number) => async (): Promise<ExhibitionVisitDetail> => {
      const res = await axiosInstance.get(
        `/api/v1/exhibitions/visit/${exhibitionId}`,
      );
      return res.data.result;
    },

  // 인기 전시 상세
  popularExhibitionDetail:
    (exhibitionId: number) => async (): Promise<ExhibitionPopularDetail> => {
      const res = await axiosInstance.get(
        `/api/v1/exhibitions/popular/${exhibitionId}`,
      );
      return res.data.result;
    },
};
export default queryFactory;
