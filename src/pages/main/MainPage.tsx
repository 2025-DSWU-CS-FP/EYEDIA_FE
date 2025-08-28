import { useEffect, useMemo, useState } from 'react';

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
import usePopularExhibitions from '@/services/queries/usePopularExhibitions';
import s3ToHttp from '@/utils/url';

export default function MainPage() {
  const [loading, setLoading] = useState({
    popular: false,
    recent: true,
    taste: true,
  });

  // 🔹 인기 전시 “목록 API” 호출 (정렬: popular)
  //    limit을 넉넉히 주고 클라이언트에서 앞의 3개만 사용
  const {
    data,
    isFetching: isPopularLoading,
    isError,
  } = usePopularExhibitions({ page: 0, limit: 12, sort: 'popular' }, true);

  // API → 섹션 형태로 매핑 + 앞에서 3개만 사용
  const apiPopular = useMemo(
    () =>
      (data?.items ?? []).slice(0, 3).map(it => ({
        id: it.exhibitionId,
        title: it.exhibitionTitle,
        location: it.gallery ?? '',
        imageUrl: s3ToHttp(it.exhibitionImage),
      })),
    [data?.items],
  );

  // 폴백: 에러이거나 결과가 비면 mock 사용
  const popularExhibitions = useMemo(() => {
    if (isError || apiPopular.length === 0) return mockPopularExhibitions;
    return apiPopular;
  }, [apiPopular, isError]);

  // 나머지 섹션 로딩 유지
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

  return (
    <main className="flex min-h-screen w-full justify-center">
      <div className="flex w-full max-w-[43rem] flex-col gap-10 py-[3rem] pl-[2.7rem]">
        <UserGreeting userName="김아트" viewCount={12} />
        <section className="flex flex-col gap-[4rem]">
          <PopularExhibitionSection
            exhibitions={popularExhibitions}
            isLoading={isPopularLoading}
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
