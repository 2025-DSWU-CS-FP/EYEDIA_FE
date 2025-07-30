export interface Exhibition {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
}

export interface PopularExhibitionSectionProps {
  exhibitions: Exhibition[];
}
