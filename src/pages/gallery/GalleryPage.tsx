import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Empty from '@/components/common/Empty';
import SearchBar from '@/components/common/SearchBar';
import ExhibitionGrid from '@/components/gallery/ExhibitionGrid';
import FilterButtons from '@/components/gallery/FilterButtons';
import SortSelect from '@/components/gallery/SortSelect';
import Header from '@/layouts/Header';
import useExhibitionVisit from '@/services/queries/useExhibitionVisit';
import s3ToHttp from '@/utils/url';

type GridItem = {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  artworkCount: number;
  date: string;
};

type VisitItem = {
  exhibitionId: number;
  exhibitionTitle: string;
  gallery: string;
  exhibitionImage: string;
  artCount: number;
  visitedAt?: string | null;
  visitDate?: string | null;
  createdAt?: string | null;
  startAt?: string | null;
};

const toGridFromVisit = (items?: VisitItem[]): GridItem[] =>
  (items ?? []).map(i => {
    const rawDate =
      i.visitedAt ?? i.visitDate ?? i.startAt ?? i.createdAt ?? '2010-01-01';
    return {
      id: String(i.exhibitionId),
      title: i.exhibitionTitle,
      location: i.gallery,
      imageUrl: s3ToHttp(i.exhibitionImage ?? ''),
      artworkCount: i.artCount,
      date: rawDate,
    };
  });

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'전체' | '즐겨찾기'>('전체');
  const [sort, setSort] = useState<'최신순' | '날짜순'>('최신순');

  const navigate = useNavigate();
  const handleSelect = (id: number | string) => navigate(`/gallery/${id}`);

  // 부드러운 첫 진입 로딩
  const [bootLoading, setBootLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBootLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const q = search.trim();
  const keyword = q || undefined;
  const isBookmarked = filter === '즐겨찾기' ? true : undefined;
  const sortParam: 'RECENT' | 'DATE' = sort === '최신순' ? 'RECENT' : 'DATE';

  const { data: visitPage, isFetching: isVisitFetching } = useExhibitionVisit(
    { keyword, isBookmarked, sort: sortParam, page: 0, limit: 24 },
    true,
  );

  const gridItems: GridItem[] = useMemo(() => {
    const visitItems = visitPage?.items as VisitItem[] | undefined;
    return toGridFromVisit(visitItems);
  }, [visitPage]);

  const exhibitionsForGrid = useMemo(() => {
    const isPlaceholder = (d: string) => d === '2010-01-01';
    return [...gridItems].sort((a, b) => {
      const aPh = isPlaceholder(a.date);
      const bPh = isPlaceholder(b.date);
      if (aPh !== bPh) return aPh ? 1 : -1;
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === '최신순' ? db - da : da - db;
    });
  }, [gridItems, sort]);

  const isLoading = bootLoading || isVisitFetching;
  const hasData = exhibitionsForGrid.length > 0;

  let gridContent: React.ReactNode;
  if (isLoading) {
    gridContent = (
      <ExhibitionGrid onSelect={handleSelect} exhibitions={[]} isLoading />
    );
  } else if (hasData) {
    gridContent = (
      <ExhibitionGrid
        onSelect={handleSelect}
        exhibitions={exhibitionsForGrid}
      />
    );
  } else {
    gridContent = (
      <div className="py-[10rem]">
        <Empty
          title="아직 즐겨 찾는 전시가 없어요."
          description="좋아하는 전시를 추가해 보세요."
        />
      </div>
    );
  }

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

      {gridContent}
    </main>
  );
}
