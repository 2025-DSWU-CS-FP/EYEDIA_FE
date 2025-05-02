import artwork from '@/assets/images/sample/artwork.png';
import bannerImg from '@/assets/images/sample/banner.png';
import recent1 from '@/assets/images/sample/recent1.png';
import recent2 from '@/assets/images/sample/recent2.png';
import recent3 from '@/assets/images/sample/recent3.png';

import SearchBar from '@/components/common/SearchBar';
import BannerCarousel from '@/components/main/BannerCarousel';
import ExhibitionCard from '@/components/main/ExhibitionCard';
import RecentArtworkCard from '@/components/main/RecentArtworkCard';
import RecommendGrid from '@/components/main/RecommendGrid';
import SectionTitle from '@/components/main/SectionTitle';

export default function MainPage() {
  return (
    <div className="pb-28">
      <div className="relative">
        <BannerCarousel
          banners={[
            {
              id: 'banner1',
              imageUrl: bannerImg,
              title: '서울 리빙 디자인 페어',
              subtitle: '5월의 전시 추천',
              date: '2025.02.26~03.02',
            },
          ]}
        />
        <div className="absolute top-4 w-full px-4">
          <SearchBar />
        </div>
      </div>

      <SectionTitle title="최근 많이 방문한 전시예요" />
      <div className="flex gap-3 overflow-x-auto px-2">
        <ExhibitionCard
          imageUrl={recent1}
          title="제 13회 서울미디어시티비엔날레"
          location="서울시립미술관 서소문본관"
        />
        <ExhibitionCard
          imageUrl={recent2}
          title="이불 작가의 대규모 서베이 전시"
          location="서울시립미술관 서소문본관"
        />
        <ExhibitionCard
          imageUrl={recent3}
          title="단색화 거장 하종현을 향한 두 개의 전시"
          location="국제갤러리/아트선재센터"
        />
      </div>

      <SectionTitle title="최근 감상한 작품" actionText="더보기" />
      <div className="px-2">
        <RecentArtworkCard
          imageUrl={artwork}
          artist="문묘익"
          title="In Bed"
          year="2005"
          onReplay={() => alert('대화 다시보기')}
        />
      </div>

      <SectionTitle title="이 작품도 좋아하실 듯해요" />
      <div className="px-2">
        <RecommendGrid
          items={[
            { id: 'reco1', imageUrl: recent1, altText: '추천작1' },
            { id: 'reco2', imageUrl: recent2, altText: '추천작2' },
            { id: 'reco3', imageUrl: recent3, altText: '추천작3' },
            { id: 'reco4', imageUrl: recent1, altText: '추천작4' },
          ]}
        />
      </div>
    </div>
  );
}
