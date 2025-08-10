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

export interface RecentArtworkProps {
  title: string;
  viewDate: string;
  conversationCount: number;
  aiMessage: string;
  imageUrl: string;
  useGradientBackground?: boolean;
}
