import { useMemo } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import SearchBar from '@/components/common/SearchBar';
import ExhibitionCard from '@/components/main/ExhibitionCard';
import { exhibitionData } from '@/mock/mockData';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || '';
  const navigate = useNavigate();

  const results = useMemo(() => {
    return exhibitionData.filter(
      exh =>
        exh.title.toLowerCase().includes(query) ||
        exh.location.toLowerCase().includes(query),
    );
  }, [query]);

  const handleSearch = (newQuery: string) => {
    navigate(`/search?query=${encodeURIComponent(newQuery.trim())}`);
  };

  return (
    <div className="mx-auto w-[430px] max-w-full min-h-screen px-4 py-6 bg-white">
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} color="black" />
      </div>

      <h2 className="text-lg font-semibold mb-4">
        🔍 검색 결과:<span className="text-mainGreen">&quot;{query}&quot;</span>
      </h2>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {results.map(exh => (
            <ExhibitionCard
              key={exh.id}
              id={exh.id}
              imageUrl={exh.imageUrl}
              title={exh.title}
              location={exh.location}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20">
          😢 검색 결과가 없습니다.
        </p>
      )}
    </div>
  );
}
