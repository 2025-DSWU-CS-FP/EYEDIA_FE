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

export type ExhibitionVisitDetail = {
  exhibitionId: number;
  exhibitionTitle: string;
  gallery: string;
  exhibitionDate: string;
  exhibitionImage: string;
  exhibitionAuthor: string | null;
  visitedAt: string;
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
