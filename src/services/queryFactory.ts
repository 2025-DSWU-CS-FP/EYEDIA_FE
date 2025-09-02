import axiosInstance from '@/services/axiosInstance';
import type {
  ExhibitionSuggestItem,
  ExhibitionVisitDetail,
  ExhibitionPopularDetail,
  ExhibitionVisitRecentPage,
  PopularExhibitionItem,
  PopularExhibitionsPage,
  ChatMessage,
  BadgeStatus,
  MyBadgesResult,
  ScrapItem,
  RecentViewedPage,
} from '@/types';

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
      const res = await axiosInstance.get('/api/v1/exhibitions/popular/top', {
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

  exhibitionVisitRecent:
    (params: {
      keyword?: string;
      isBookmarked?: boolean;
      sort?: 'RECENT' | 'DATE';
      page?: number;
      limit?: number;
    }) =>
    async (): Promise<ExhibitionVisitRecentPage> => {
      const {
        keyword,
        isBookmarked,
        sort = 'RECENT',
        page = 0,
        limit = 12,
      } = params ?? {};
      const res = await axiosInstance.get('/api/v1/exhibitions/viewed', {
        params: { keyword, isBookmarked, sort, page, limit },
      });
      return res.data.result;
    },

  // 뱃지 조회
  myBadges: (status?: BadgeStatus) => async (): Promise<MyBadgesResult> => {
    const res = await axiosInstance.get('/api/vi/badges', {
      params: { status },
    });
    return res.data.result as MyBadgesResult;
  },
  scrapsByExhibition:
    (userId: number, location: string) => async (): Promise<ScrapItem[]> => {
      const res = await axiosInstance.get(`/api/v1/scraps/list/${userId}`, {
        params: { location },
      });
      return res.data as ScrapItem[];
    },

  recentViewedArtworks:
    (params: { page?: number; limit?: number; sort?: 'recent' } = {}) =>
    async (): Promise<RecentViewedPage> => {
      const { page = 0, limit = 10, sort = 'recent' } = params;
      const res = await axiosInstance.get('/api/v1/artworks/viewed', {
        params: { page, limit, sort },
      });
      return res.data as RecentViewedPage;
    },
};
export default queryFactory;
