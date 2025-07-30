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
}

export interface RecentArtworkWithAIMessageProps {
  title: string;
  viewDate: string;
  conversationCount: number;
  aiMessage: string;
  imageUrl: string;
}
