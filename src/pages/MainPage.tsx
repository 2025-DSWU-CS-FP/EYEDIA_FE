import { useNavigate } from 'react-router-dom';

import SearchBar from '@/components/common/SearchBar';
import BannerCarousel from '@/components/main/BannerCarousel';
import ExhibitionCard from '@/components/main/ExhibitionCard';
import RecentArtworkCard from '@/components/main/RecentArtworkCard';
import RecommendGrid from '@/components/main/RecommendGrid';
import SectionTitle from '@/components/main/SectionTitle';
import {
  bannerData,
  exhibitionData,
  recentArtwork,
  recommendedItems,
} from '@/mock/mockData';

export default function MainPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="relative">
        <BannerCarousel banners={bannerData} />
        <div className="absolute top-4 w-full px-4">
          <SearchBar
            onSearch={query =>
              navigate(`/search-result?query=${encodeURIComponent(query)}`)
            }
          />
        </div>
      </div>

      <SectionTitle title="최근 많이 방문한 전시예요" />
      <div className="flex gap-3 overflow-x-auto px-2">
        {exhibitionData.map(exh => (
          <ExhibitionCard
            key={exh.id}
            id={exh.id}
            imageUrl={exh.imageUrl}
            title={exh.title}
            location={exh.location}
          />
        ))}
      </div>

      <SectionTitle title="최근 감상한 작품" actionText="더보기" />
      <div className="px-2">
        <RecentArtworkCard
          imageUrl={recentArtwork.imageUrl}
          artist={recentArtwork.artist}
          title={recentArtwork.title}
          year={recentArtwork.year}
          onReplay={() => navigate('/chat/1')}
        />
      </div>

      <SectionTitle title="이 작품도 좋아하실 듯해요" />
      <div className="px-2">
        <RecommendGrid items={recommendedItems} />
      </div>
    </div>
  );
}
