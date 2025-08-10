export interface Keyword {
  id: string;
  label: string;
  isSelected: boolean;
}

export interface KeywordListProps {
  keywords: Keyword[];
  isLoading?: boolean;
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
  isLoading?: boolean;
}

export type ArtworkCardProps =
  | {
      // 스켈레톤 모드
      isLoading: true;
      title?: string;
      artist?: string;
      imageUrl?: string;
    }
  | {
      // 실데이터 모드
      isLoading?: false;
      title: string;
      artist: string;
      imageUrl: string;
    };

export interface ExhibitionCardProps {
  title: string;
  location: string;
  imageUrl: string;
  artworkCount?: number;
}
