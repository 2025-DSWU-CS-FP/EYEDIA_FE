import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import SearchBar from '@/components/common/SearchBar';
import ExhibitionGrid from '@/components/gallery/ExhibitionGrid';
import Header from '@/layouts/Header';
import usePopularExhibitions from '@/services/queries/usePopularExhibitions';
import usePopularExhibitionsSuggest from '@/services/queries/usePopularExhibitionsSuggest';
import s3ToHttp from '@/utils/url';

export default function PopularExhibitionPage() {
  const [search, setSearch] = useState('');
  const keyword = search.trim() || undefined;
  const hasKeyword = Boolean(keyword);
  const navigate = useNavigate();
  const handleSelect = (id: number | string) => navigate(`/popular/${id}`);
  const { data: list, isFetching: isListFetching } = usePopularExhibitions(
    { keyword: undefined, page: 0, limit: 24, sort: 'popular' },
    !hasKeyword,
  );

  const { data: suggest, isFetching: isSuggestFetching } =
    usePopularExhibitionsSuggest(keyword, 24, hasKeyword);

  const baseItems = hasKeyword ? suggest : list?.items;

  const exhibitionsForGrid = useMemo(
    () =>
      (baseItems ?? []).map(item => ({
        id: String(item.exhibitionId),
        title: item.exhibitionTitle,
        location: item.gallery ?? '',
        imageUrl: s3ToHttp(item.exhibitionImage ?? ''),
        artworkCount: item.artCount ?? 0,
        date: '1970-01-01',
      })),
    [baseItems],
  );

  const isLoading = hasKeyword ? isSuggestFetching : isListFetching;

  return (
    <main
      className="flex min-h-screen w-full flex-col pb-8"
      aria-busy={isLoading}
    >
      <Header
        title="인기 전시"
        backgroundColorClass="bg-gray-5"
        showBackButton
      />
      <section className="px-[2.4rem]">
        <SearchBar value={search} onChange={setSearch} />
      </section>

      <ExhibitionGrid
        exhibitions={exhibitionsForGrid}
        isLoading={isLoading}
        onSelect={handleSelect}
      />
    </main>
  );
}
