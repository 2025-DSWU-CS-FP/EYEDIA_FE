import { useEffect, useMemo, useState } from 'react';

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

/** s3://bucket/key -> https://bucket.s3.ap-northeast-2.amazonaws.com/key */
const normalizeS3Url = (url?: string): string => {
  if (!url) return '';
  if (!url.startsWith('s3://')) return url;
  const path = url.replace(/^s3:\/\//, '');
  const [bucket, ...rest] = path.split('/');
  const key = rest.join('/');
  return `https://${bucket}.s3.ap-northeast-2.amazonaws.com/${key}`;
};

const toGridItems = (items?: ExhibitionSuggestItem[]): GridItem[] =>
  (items ?? []).map(i => ({
    id: String(i.exhibitionId),
    title: i.exhibitionTitle,
    location: i.gallery,
    imageUrl: normalizeS3Url(i.exhibitionImage), // 🔁 여기서 변환
    artworkCount: i.artCount,
    date: '1970-01-01',
  }));

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [sort, setSort] = useState<'최신순' | '날짜순'>('최신순');

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
    const weight = (d: string) => (d === '1970-01-01' ? -1 : 1);
    return [...filtered].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (sort === '최신순') return weight(a.date) * db - weight(b.date) * da;
      return weight(b.date) * da - weight(a.date) * db;
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

      <ExhibitionGrid exhibitions={exhibitionsForGrid} isLoading={isLoading} />
    </main>
  );
}
