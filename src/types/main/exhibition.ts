export interface Exhibition {
  id: string;
  title: string;
  location: string;
}
export interface ExhibitionCardProps {
  id?: string;
  imageUrl: string;
  title: string;
  location: string;
}
export interface ExhibitionItem {
  id: number;
  title: string;
  count: number;
  img: string;
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
