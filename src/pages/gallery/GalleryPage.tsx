import { useEffect, useState } from 'react';

import popular1 from '@/assets/images/sample/main-popular1.png';
import popular2 from '@/assets/images/sample/main-popular2.png';
import popular3 from '@/assets/images/sample/main-popular3.png';
import SearchBar from '@/components/common/SearchBar';
import ExhibitionGrid from '@/components/gallery/ExhibitionGrid';
import FilterButtons from '@/components/gallery/FilterButtons';
import SortSelect from '@/components/gallery/SortSelect';
import Header from '@/layouts/Header';

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

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [sort, setSort] = useState<'최신순' | '날짜순'>('최신순');

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const sortedExhibitions = [...exhibitionsData].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sort === '최신순' ? dateB - dateA : dateA - dateB;
  });

  return (
    <main className="flex min-h-screen w-full flex-col pb-8">
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

      <ExhibitionGrid exhibitions={sortedExhibitions} isLoading={isLoading} />
    </main>
  );
}
