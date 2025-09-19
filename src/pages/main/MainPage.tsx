import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import PopularExhibitionSection from '@/components/main/section/PopularExhibitionSection';
import RecentArtworkSection from '@/components/main/section/RecentArtworkSection';
import TasteArtworkSection from '@/components/main/section/TasteArtworkSection';
import UserGreeting from '@/components/main/UserGreeting';
import usePopularExhibitionsTop from '@/services/queries/usePopularExhibitionsTop';
import useRecommendExhibitions from '@/services/queries/useRecommendExhibitions';
import useTasteKeywords from '@/services/queries/useTasteKeywords';
import s3ToHttp from '@/utils/url';

export default function MainPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    try {
      const nameRaw = (localStorage.getItem('name') ?? '').trim();
      setUserName(nameRaw || '사용자');
      const raw = localStorage.getItem('monthlyVisitCount');
      const n = raw !== null ? Number(raw) : NaN;
      setViewCount(Number.isFinite(n) && n >= 0 ? n : 0);
    } catch {
      setUserName('사용자');
      setViewCount(0);
    }
  }, []);

  const {
    data: topPopular,
    isFetching: isPopularLoading,
    isError: isPopularError,
  } = usePopularExhibitionsTop(3, true);

  const popularExhibitions = useMemo(() => {
    const mapped =
      (topPopular ?? []).slice(0, 3).map(it => ({
        id: it.exhibitionId,
        title: it.exhibitionTitle,
        location: it.gallery ?? '',
        imageUrl: s3ToHttp(it.exhibitionImage ?? ''),
      })) ?? [];
    if (isPopularError || mapped.length === 0) return [];
    return mapped;
  }, [topPopular, isPopularError]);

  const { data: tasteKeywords = [], isFetching: isKwLoading } =
    useTasteKeywords();

  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedKeyword && tasteKeywords.length > 0) {
      setSelectedKeyword(tasteKeywords[0].id);
    }
  }, [tasteKeywords, selectedKeyword]);

  const { data: recExhibitions = [], isFetching: isRecLoading } =
    useRecommendExhibitions(selectedKeyword);

  const tasteArtworks = useMemo(
    () =>
      recExhibitions.map(e => ({
        id: e.id,
        title: e.title,
        artist: e.artist,
        thumbnailUrl: e.thumbnailUrl,
      })),
    [recExhibitions],
  );

  const handlePopularMore = () => navigate('/popular-exhibition');
  const handlePopularSelect = (id: number | string) =>
    navigate(`/popular/${id}`);

  return (
    <main className="flex min-h-screen w-full justify-center">
      <div className="flex w-full max-w-[43rem] flex-col gap-10 py-[3rem] pl-[2.7rem]">
        <UserGreeting userName={userName} viewCount={viewCount} />
        <section className="flex flex-col gap-[4rem]">
          <PopularExhibitionSection
            exhibitions={popularExhibitions}
            isLoading={isPopularLoading}
            onMoreClick={handlePopularMore}
            onSelect={handlePopularSelect}
          />

          <RecentArtworkSection />

          <TasteArtworkSection
            keywords={tasteKeywords.map(k => ({
              ...k,
              isSelected: k.id === selectedKeyword,
            }))}
            artworks={tasteArtworks}
            isLoading={isKwLoading || isRecLoading}
            onKeywordSelect={(id: string) => setSelectedKeyword(id)}
          />
        </section>
      </div>
    </main>
  );
}
