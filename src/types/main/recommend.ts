export interface RecommendItem {
  id: string;
  imageUrl: string;
  altText: string;
}

export interface RecommendGridProps {
  items: RecommendItem[];
}
