export interface KeywordListProps {
  keywords: Keyword[];
  isLoading?: boolean;
}

export interface Keyword {
  id: string;
  label: string;
  isSelected?: boolean;
}

type TasteArtworkBase = {
  id: string | number;
  title: string;
  artist: string;
};

// 둘 중 하나만 필수로 허용
export type TasteArtwork =
  | (TasteArtworkBase & { thumbnailUrl: string; imageUrl?: string })
  | (TasteArtworkBase & { imageUrl: string; thumbnailUrl?: string });

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
