export interface ScrapItem {
  id: number;
  userId: number;
  paintingId: number;
  date: string;
  excerpt: string;
  location: string;
  imageUrl: string | null;
  artist: string | null;
  title?: string | null;
}

export interface SaveScrapRequest {
  paintingId: number;
  date: string;
  excerpt: string;
  location: string;
  artist: string;
}

export interface SaveScrapResponse {
  message: string;
}

export interface RecentViewedPage {
  content: ScrapItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
