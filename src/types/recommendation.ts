export type ExhibitionCategoryCode =
  | 'ANCIENT'
  | 'RENAISSANCE'
  | 'MODERN'
  | 'CONTEMPORARY'
  | 'WARM'
  | 'COOL'
  | 'MONOTONE'
  | 'PASTEL'
  | 'HEALING'
  | 'HUMOROUS'
  | 'EMOTIONAL'
  | 'CALM'
  | 'PASSIONATE'
  | 'INTERACTIVE'
  | 'OBSERVATIONAL'
  | 'REPETITIVE'
  | 'SCARY';

export type KeywordApiItem =
  | string
  | { koreanName: string; code: ExhibitionCategoryCode };

export interface TasteKeywordVM {
  id: ExhibitionCategoryCode;
  label: string;
  isSelected?: boolean;
}

export interface ExhibitionRecItem {
  id: number | string;
  title: string;
  artist: string;
  location: string;
  thumbnailUrl: string;
  imageUrl?: string;
}
