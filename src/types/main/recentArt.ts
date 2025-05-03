export interface RecentArtworkCardProps {
  imageUrl: string;
  artist: string;
  title: string;
  year: string;
  onReplay?: () => void;
}
