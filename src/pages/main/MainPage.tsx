import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import PopularExhibitionSection from '@/components/main/section/PopularExhibitionSection';
import RecentArtworkSection from '@/components/main/section/RecentArtworkSection';
import TasteArtworkSection from '@/components/main/section/TasteArtworkSection';
import UserGreeting from '@/components/main/UserGreeting';
import {
  popularExhibitions as mockPopularExhibitions,
  recentArtworks,
  keywords,
  tasteArtworks,
} from '@/mock/mainData';
import usePopularExhibitionsTop from '@/services/queries/usePopularExhibitionsTop';
import s3ToHttp from '@/utils/url';

export default function MainPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    popular: false,
    recent: true,
    taste: true,
  });

  const {
    data: topPopular,
    isFetching: isPopularLoading,
    isError,
  } = usePopularExhibitionsTop(3, true);

  const popularExhibitions = useMemo(() => {
    const mapped =
      (topPopular ?? []).slice(0, 3).map(it => ({
        id: it.exhibitionId,
        title: it.exhibitionTitle,
        location: it.gallery ?? '',
        imageUrl: s3ToHttp(it.exhibitionImage ?? ''),
      })) ?? [];
    if (isError || mapped.length === 0) return mockPopularExhibitions;
    return mapped;
  }, [topPopular, isError]);

  useEffect(() => {
    const t2 = setTimeout(
      () => setLoading(s => ({ ...s, recent: false })),
      300,
    );
    const t3 = setTimeout(() => setLoading(s => ({ ...s, taste: false })), 300);
    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handlePopularMore = () => navigate('/popular-exhibition');
  const handlePopularSelect = (id: number | string) =>
    navigate(`/popular/${id}`);

  return (
    <main className="flex min-h-screen w-full justify-center">
      <div className="flex w-full max-w-[43rem] flex-col gap-10 py-[3rem] pl-[2.7rem]">
        <UserGreeting userName="김아트" viewCount={12} />
        <section className="flex flex-col gap-[4rem]">
          <PopularExhibitionSection
            exhibitions={popularExhibitions}
            isLoading={isPopularLoading}
            onMoreClick={handlePopularMore}
            onSelect={handlePopularSelect}
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
