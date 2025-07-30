export interface Keyword {
  id: string;
  label: string;
  isSelected: boolean;
}

export interface KeywordListProps {
  keywords: Keyword[];
}

interface TasteArtwork {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
}

export interface TasteArtworkSectionProps {
  keywords: Keyword[];
  artworks: TasteArtwork[];
}

export interface ArtworkCardProps {
  title: string;
  artist: string;
  imageUrl: string;
}

export interface ExhibitionCardProps {
  title: string;
  location: string;
  imageUrl: string;
}
