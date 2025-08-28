import { useMemo, useState } from 'react';

import SearchBar from '@/components/common/SearchBar';
import ExhibitionGrid from '@/components/gallery/ExhibitionGrid';
import Header from '@/layouts/Header';
import usePopularExhibitions from '@/services/queries/usePopularExhibitions';
import s3ToHttp from '@/utils/url';

export default function PopularExhibitionPage() {
  const [search, setSearch] = useState('');

  const keyword = search.trim() || undefined;
  const { data, isFetching } = usePopularExhibitions(
    { keyword, page: 0, limit: 24, sort: 'popular' },
    true,
  );

  const exhibitionsForGrid = useMemo(
    () =>
      (data?.items ?? []).map(item => ({
        id: String(item.exhibitionId),
        title: item.exhibitionTitle,
        location: item.gallery ?? '',
        imageUrl: s3ToHttp(item.exhibitionImage),
        artworkCount: item.artCount ?? 0,
        date: '1970-01-01',
      })),
    [data?.items],
  );

  return (
    <main
      className="flex min-h-screen w-full flex-col pb-8"
      aria-busy={isFetching}
    >
      <Header
        title="인기 전시"
        backgroundColorClass="bg-gray-5"
        showBackButton
      />
      <section className="px-[2.4rem]">
        <SearchBar value={search} onChange={setSearch} />
      </section>

      <ExhibitionGrid exhibitions={exhibitionsForGrid} isLoading={isFetching} />
    </main>
  );
}
