import artwork from '@/assets/images/sample/artwork.png';
import bannerImg from '@/assets/images/sample/banner.png';
import rec1 from '@/assets/images/sample/rec1.png';
import rec2 from '@/assets/images/sample/rec2.png';
import rec3 from '@/assets/images/sample/rec3.png';
import rec4 from '@/assets/images/sample/rec4.png';
import recent1 from '@/assets/images/sample/recent1.png';
import recent2 from '@/assets/images/sample/recent2.png';
import recent3 from '@/assets/images/sample/recent3.png';

export const bannerData = [
  {
    id: 'banner1',
    imageUrl: bannerImg,
    title: '서울 리빙 디자인 페어',
    subtitle: '5월의 전시 추천',
    date: '2025.02.26 ~ 03.02',
  },
  {
    id: 'banner2',
    imageUrl: recent3,
    title: '제 13회 서울 미디어시티비엔날레',
    subtitle: '5월의 전시 추천',
    date: '2025.02.27 ~ 03.05',
  },
];

export const exhibitionData = [
  {
    id: 'exh1',
    imageUrl: recent1,
    title: '제 13회 서울미디어시티비엔날레',
    location: '서울시립미술관 서소문본관',
  },
  {
    id: 'exh2',
    imageUrl: recent2,
    title: '이불 작가의 대규모 서베이 전시',
    location: '서울시립미술관 서소문본관',
  },
  {
    id: 'exh3',
    imageUrl: recent3,
    title: '단색화 거장 하종현을 향한 두 개의 전시',
    location: '국제갤러리/아트선재센터',
  },
];

export const recentArtwork = {
  imageUrl: artwork,
  artist: '문묘익',
  title: 'In Bed',
  year: '2005',
};

export const recommendedItems = [
  { id: 'reco1', imageUrl: rec1, altText: '추천작1' },
  { id: 'reco2', imageUrl: rec2, altText: '추천작2' },
  { id: 'reco3', imageUrl: rec3, altText: '추천작3' },
  { id: 'reco4', imageUrl: rec4, altText: '추천작4' },
];
