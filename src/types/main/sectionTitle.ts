export interface SectionHeaderProps {
  title: string;
  onMoreClick?: () => void;
  showMore?: boolean;
}

export interface UserGreetingProps {
  userName: string;
  viewCount: number;
}
