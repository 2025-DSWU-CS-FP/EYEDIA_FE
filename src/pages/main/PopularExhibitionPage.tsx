import { useEffect, useMemo, useState } from 'react';

import popular1 from '@/assets/images/sample/main-popular1.png';
import popular2 from '@/assets/images/sample/main-popular2.png';
import popular3 from '@/assets/images/sample/main-popular3.png';
import SearchBar from '@/components/common/SearchBar';
import ExhibitionGrid from '@/components/gallery/ExhibitionGrid';
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

export default function PopularExhibitionPage() {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // TODO: React Query isLoading 사용
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return exhibitionsData;
    return exhibitionsData.filter(
      e => e.title.includes(q) || e.location.includes(q),
    );
  }, [search]);

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

      <ExhibitionGrid exhibitions={filtered} isLoading={isLoading} />
    </main>
  );
}
