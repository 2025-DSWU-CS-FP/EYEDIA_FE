import axiosInstance from '@/services/axiosInstance';
import type { ChatMessage } from '@/types';
import type {
  ExhibitionSuggestItem,
  ExhibitionVisitDetail,
  ExhibitionPopularDetail,
  ExhibitionVisitRecentPage,
  PopularExhibitionItem,
  PopularExhibitionsPage,
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
  exhibitionVisitRecent:
    (page = 0, limit = 12) =>
    async (): Promise<ExhibitionVisitRecentPage> => {
      const res = await axiosInstance.get(
        '/api/v1/exhibitions/visit/filter-recent',
        { params: { page, limit } },
      );
      return res.data.result;
    },

  // 인기 전시 전체 조회(페이징)
  popularExhibitions:
    (params: {
      keyword?: string;
      page?: number;
      limit?: number;
      sort?: 'popular' | 'latest';
    }) =>
    async (): Promise<PopularExhibitionsPage> => {
      const { keyword, page = 0, limit = 12, sort = 'popular' } = params ?? {};
      const res = await axiosInstance.get('/api/v1/exhibitions/popular', {
        params: { keyword, page, limit, sort },
      });
      return res.data.result;
    },

  // 인기 전시 TOP N
  popularExhibitionsTop:
    (size = 3) =>
    async (): Promise<PopularExhibitionItem[]> => {
      const res = await axiosInstance.get('/v1/exhibitions/popular/top', {
        params: { size },
      });
      return res.data.result;
    },

  // 인기 전시 검색
  popularExhibitionsSuggest:
    (q: string, limit = 24) =>
    async (): Promise<PopularExhibitionItem[]> => {
      const res = await axiosInstance.get(
        '/api/v1/exhibitions/popular/suggest',
        {
          params: { q, limit },
        },
      );
      return res.data.result;
    },
};
export default queryFactory;
