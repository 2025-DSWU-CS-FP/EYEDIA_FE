import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import popular1 from '@/assets/images/sample/main-popular1.png';
import popular2 from '@/assets/images/sample/main-popular2.png';
import popular3 from '@/assets/images/sample/main-popular3.png';
import SearchBar from '@/components/common/SearchBar';
import ExhibitionGrid from '@/components/gallery/ExhibitionGrid';
import FilterButtons from '@/components/gallery/FilterButtons';
import SortSelect from '@/components/gallery/SortSelect';
import Header from '@/layouts/Header';
import useExhibitionSuggest from '@/services/queries/useExhibitionSuggest';
import type { ExhibitionSuggestItem } from '@/types/exhibition';
import s3ToHttp from '@/utils/url';

const exhibitionsData = [
  {
    id: '1',
    title: '요시고 사진전',
    location: '서울시립미술관 서소문본관',
    imageUrl: popular1,
    artworkCount: 9,
    date: '2024-10-01',
  },
  {
    id: '2',
    title: '이경준 사진전 부산',
    location: '서울시립미술관 서소문본관',
    imageUrl: popular2,
    artworkCount: 5,
    date: '2024-09-20',
  },
  {
    id: '3',
    title: '요시고 사진전',
    location: '서울시립미술관 서소문본관',
    imageUrl: popular3,
    artworkCount: 9,
    date: '2024-09-25',
  },
  {
    id: '4',
    title: '이경준 사진전 부산',
    location: '서울시립미술관 서소문본관',
    imageUrl: popular2,
    artworkCount: 5,
    date: '2024-08-30',
  },
];

type GridItem = (typeof exhibitionsData)[number];

const toGridItems = (items?: ExhibitionSuggestItem[]): GridItem[] =>
  (items ?? []).map(i => ({
    id: String(i.exhibitionId),
    title: i.exhibitionTitle,
    location: i.gallery,
    imageUrl: s3ToHttp(i.exhibitionImage),
    artworkCount: i.artCount,
    date: '2010-01-01',
  }));

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [sort, setSort] = useState<'최신순' | '날짜순'>('최신순');
  const navigate = useNavigate();
  const handleSelect = (id: number | string) => navigate(`/gallery/${id}`);
  const [bootLoading, setBootLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBootLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const { data: suggest, isFetching } = useExhibitionSuggest(search, 20, true);

  const base: GridItem[] = useMemo(() => {
    const q = search.trim();
    if (!q) return exhibitionsData;
    return toGridItems(suggest);
  }, [search, suggest]);

  const filtered = useMemo(() => {
    if (filter === '전체') return base;
    return base;
  }, [base, filter]);

  const exhibitionsForGrid = useMemo(() => {
    const isPlaceholder = (d: string) => d === '2010-01-01';
    return [...filtered].sort((a, b) => {
      const aPh = isPlaceholder(a.date);
      const bPh = isPlaceholder(b.date);
      if (aPh !== bPh) return aPh ? 1 : -1;
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === '최신순' ? db - da : da - db;
    });
  }, [filtered, sort]);

  const isLoading = bootLoading || (search.trim().length > 0 && isFetching);

  return (
    <main
      className="flex min-h-screen w-full flex-col pb-8"
      aria-busy={isLoading}
    >
      <Header
        title="나의 전시"
        backgroundColorClass="bg-gray-5"
        showBackButton
      />
      <section className="flex flex-col gap-[1.6rem] px-[2.4rem]">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex items-center gap-2">
          <FilterButtons filter={filter} onFilterChange={setFilter} />
          <div className="flex-1" />
          <SortSelect
            sort={sort}
            onChange={value => setSort(value as '최신순' | '날짜순')}
            options={['최신순', '날짜순']}
          />
        </div>
      </section>

      <ExhibitionGrid
        onSelect={handleSelect}
        exhibitions={exhibitionsForGrid}
        isLoading={isLoading}
      />
    </main>
  );
}
