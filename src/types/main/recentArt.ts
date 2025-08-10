export interface Artwork {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  viewDate: string;
  conversationCount: number;
  aiMessage?: string;
}

export interface RecentArtworkSectionProps {
  artworks: Artwork[];
  isLoading?: boolean;
}

export type RecentArtworkProps =
  | {
      // 스켈레톤 모드
      isLoading: true;
      title?: string;
      viewDate?: string;
      conversationCount?: number;
      aiMessage?: string;
      imageUrl?: string;
      useGradientBackground?: boolean;
    }
  | {
      // 실데이터 모드
      isLoading?: false;
      title: string;
      viewDate: string;
      conversationCount: number;
      aiMessage?: string;
      imageUrl: string;
      useGradientBackground?: boolean;
    };
