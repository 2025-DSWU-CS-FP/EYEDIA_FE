import { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState({
    popular: true,
    recent: true,
    taste: true,
  });

  useEffect(() => {
    const t1 = setTimeout(
      () => setLoading(s => ({ ...s, popular: false })),
      300,
    );
    const t2 = setTimeout(
      () => setLoading(s => ({ ...s, recent: false })),
      300,
    );
    const t3 = setTimeout(() => setLoading(s => ({ ...s, taste: false })), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <main className="flex min-h-screen w-full justify-center">
      <div className="flex w-full max-w-[43rem] flex-col gap-10 py-[3rem] pl-[2.7rem]">
        <UserGreeting userName="김아트" viewCount={12} />
        <section className="flex flex-col gap-[4rem]">
          <PopularExhibitionSection
            exhibitions={popularExhibitions}
            isLoading={loading.popular}
          />
          <RecentArtworkSection
            artworks={recentArtworks}
            isLoading={loading.recent}
          />
          <TasteArtworkSection
            keywords={keywords}
            artworks={tasteArtworks}
            isLoading={loading.taste}
          />
        </section>
      </div>
    </main>
  );
}
