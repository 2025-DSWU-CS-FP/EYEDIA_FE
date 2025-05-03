export interface ExhibitionCardProps {
  imageUrl: string;
  title: string;
  location: string;
}

export interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  date: string;
}

export interface BannerCarouselProps {
  banners: BannerItem[];
}
