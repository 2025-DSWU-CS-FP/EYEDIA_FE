export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type ExhibitionSuggestItem = {
  exhibitionId: number;
  exhibitionTitle: string;
  exhibitionImage: string;
  artCount: number;
  gallery: string;
};

export type PaintingListItem = {
  paintingId: number;
  image: string;
  paintingTitle: string;
  paintingAuthor: string;
};

export type ExhibitionVisitDetail = {
  exhibitionId: number;
  exhibitionTitle: string;
  gallery: string;
  exhibitionDate: string;
  exhibitionImage: string;
  exhibitionAuthor: string | null;
  visitedAt: string;
  bookmark: boolean;
  paintings: PaintingListItem[];
};

export type ExhibitionPopularDetail = {
  exhibitionId: number;
  exhibitionTitle: string;
  gallery: string;
  exhibitionDescription: string;
  exhibitionDate: string;
  exhibitionImage: string;
  exhibitionAuthor: string;
  location: string;
};

export type PageMeta = {
  page: number;
  limit: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
};

export type ExhibitionVisitListItem = {
  exhibitionId: number;
  exhibitionTitle: string;
  exhibitionImage: string;
  artCount: number;
  gallery: string;
};

export type ExhibitionVisitRecentPage = PageMeta & {
  items: ExhibitionVisitListItem[];
};

export type PopularExhibitionItem = {
  exhibitionId: number;
  exhibitionTitle: string;
  exhibitionImage: string | null;
  artCount: number | null;
  gallery: string | null;
};

export type PopularExhibitionsPage = PageMeta & {
  items: PopularExhibitionItem[];
};
