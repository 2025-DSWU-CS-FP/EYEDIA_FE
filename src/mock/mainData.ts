import popular1 from '@/assets/images/sample/main-popular1.png';
import popular2 from '@/assets/images/sample/main-popular2.png';
import popular3 from '@/assets/images/sample/main-popular3.png';
import recent1 from '@/assets/images/sample/main-recent1.png';
import taste1 from '@/assets/images/sample/main-taste1.png';
import taste2 from '@/assets/images/sample/main-taste2.png';

export const popularExhibitions = [
  {
    id: '1',
    title: '요시고 사진전',
    location: '서울시립미술관 서소문본관',
    imageUrl: popular1,
  },
  {
    id: '2',
    title: '이경준 사진전 부산',
    location: '서울시립미술관 서소문본관',
    imageUrl: popular2,
  },
  {
    id: '3',
    title: '이경준 사진전 부산',
    location: '서울시립미술관 서소문본관',
    imageUrl: popular3,
  },
];

export const recentArtworks = [
  {
    id: '1',
    title: '이삭을 줍는 여인들',
    artist: '장 프랑수아 밀레',
    imageUrl: recent1,
    viewDate: '2024년 5월 22일 감상',
    conversationCount: 9,
    aiMessage:
      '이삭을 줍는 여인들은 실제 여성\n노동자들의 삶을 보여준 작품이죠.',
  },
  {
    id: '2',
    title: '이삭을 줍는 여인들',
    artist: '장 프랑수아 밀레',
    imageUrl: recent1,
    viewDate: '2024년 5월 22일 감상',
    conversationCount: 9,
    aiMessage:
      '이삭을 줍는 여인들은 실제 여성\n노동자들의 삶을 보여준 작품이죠.',
  },
];

export const keywords = [
  { id: '1', label: '화사한', isSelected: true },
  { id: '2', label: '인상주의', isSelected: false },
  { id: '3', label: '추상화', isSelected: false },
  { id: '4', label: '조각', isSelected: false },
  { id: '5', label: '자연주의', isSelected: false },
  { id: '6', label: '모던아트', isSelected: false },
];

export const tasteArtworks = [
  {
    id: '1',
    title: '따뜻한 휴일의 기록',
    artist: '프란체스코 요시고',
    imageUrl: taste1,
  },
  {
    id: '2',
    title: '따뜻한 휴일의 기록',
    artist: '프란체스코 요시고',
    imageUrl: taste2,
  },
];
