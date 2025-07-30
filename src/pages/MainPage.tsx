import PopularExhibitionSection from '@/components/main/section/PopularExhibitionSection';
import RecentArtworkSection from '@/components/main/section/RecentArtworkSection';
import TasteArtworkSection from '@/components/main/section/TasteArtworkSection';
import UserGreeting from '@/components/main/UserGreeting';
import {
  popularExhibitions,
  recentArtworks,
  keywords,
  tasteArtworks,
} from '@/mock/mainData';

export default function MainPage() {
  return (
    <div className="flex min-h-screen w-full justify-center">
      <div className="flex w-full max-w-[43rem] flex-col gap-10 px-[2.7rem] py-[3rem]">
        <UserGreeting userName="김아트" viewCount={12} />
        <div className="flex flex-col gap-[4rem]">
          <PopularExhibitionSection exhibitions={popularExhibitions} />
          <RecentArtworkSection artworks={recentArtworks} />
          <TasteArtworkSection keywords={keywords} artworks={tasteArtworks} />
        </div>
      </div>
    </div>
  );
}
