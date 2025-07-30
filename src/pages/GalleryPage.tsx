import { useState } from 'react';

import popular1 from '@/assets/images/sample/main-popular1.png';
import popular2 from '@/assets/images/sample/main-popular2.png';
import popular3 from '@/assets/images/sample/main-popular3.png';
import ExhibitionGrid from '@/components/gallery/ExhibitionGrid';
import FilterButtons from '@/components/gallery/FilterButtons';
import SortSelect from '@/components/gallery/SortSelect';

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

  const sortedExhibitions = [...exhibitionsData].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sort === '최신순' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="flex min-h-screen w-full flex-col pb-8">
      <div className="px-6 pb-4 pt-8">
        <h1 className="text-center text-t2 font-bold">나의 전시</h1>
      </div>

      <div className="mb-4 px-6">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-[12px] bg-white px-4 py-3 text-ct3 text-gray-60 outline-none"
            placeholder="전시/작품 이름으로 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="button" className="ml-2">
            <span className="material-icons text-gray-40">search</span>
          </button>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-2 px-6">
        <FilterButtons filter={filter} onFilterChange={setFilter} />
        <div className="flex-1" />
        <SortSelect
          sort={sort}
          onChange={value => setSort(value as '최신순' | '날짜순')}
          options={['최신순', '날짜순']}
        />
      </div>

      <ExhibitionGrid exhibitions={sortedExhibitions} />
    </div>
  );
}
