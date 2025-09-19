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

export type TasteArtwork =
  | (TasteArtworkBase & { thumbnailUrl: string; imageUrl?: string })
  | (TasteArtworkBase & { imageUrl: string; thumbnailUrl?: string });

export interface TasteArtworkSectionProps {
  keywords: Keyword[];
  artworks: TasteArtwork[];
  isLoading?: boolean;
  onKeywordSelect?: (id: string) => void;
}
export type ArtworkCardProps =
  | {
      isLoading: true;
      title?: string;
      artist?: string;
      imageUrl?: string;
    }
  | {
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
