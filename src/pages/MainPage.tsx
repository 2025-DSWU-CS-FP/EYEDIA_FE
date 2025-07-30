import popular1 from '@/assets/images/sample/main-popular1.png';
import popular2 from '@/assets/images/sample/main-popular2.png';
import popular3 from '@/assets/images/sample/main-popular3.png';
import recent1 from '@/assets/images/sample/main-recent1.png';
import taste1 from '@/assets/images/sample/main-taste1.png';
import taste2 from '@/assets/images/sample/main-taste2.png';
import ArtworkCard from '@/components/main/ArtworkCard';
import PopularExhibitionCard from '@/components/main/ExhibitionCard';
import RecentArtworkWithAIMessage from '@/components/main/RecentArtworkWithAIMessage';
import UserGreeting from '@/components/main/UserGreeting';

export default function MainPage() {
  // 인기 전시 데이터
  const popularExhibitions = [
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

  // 최근 감상 작품 데이터
  const recentArtworks = [
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

  // 취향 기반 탐색 키워드
  const keywords = [
    { id: '1', label: '화사한', isSelected: true },
    { id: '2', label: '인상주의', isSelected: false },
    { id: '3', label: '추상화', isSelected: false },
    { id: '4', label: '조각', isSelected: false },
    { id: '5', label: '자연주의', isSelected: false },
    { id: '6', label: '모던아트', isSelected: false },
  ];

  // 취향 기반 작품
  const tasteArtworks = [
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

  return (
    <div className="w-full flex justify-center bg-neutral-100 min-h-screen">
      <div className="w-full max-w-[430px] flex flex-col gap-10 px-[2.7rem] pt-[3rem]">
        <UserGreeting userName="김아트" viewCount={12} />
        <div className="">
          {/* 인기 전시 섹션 */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-t3 text-gray-90">지금 인기 전시</h2>
              <span className="text-bd2 text-gray-40">더보기</span>
            </div>
            <div className="flex gap-[1.2rem] overflow-x-auto pb-2">
              {popularExhibitions.map(exh => (
                <PopularExhibitionCard
                  key={exh.id}
                  title={exh.title}
                  location={exh.location}
                  imageUrl={exh.imageUrl}
                />
              ))}
            </div>
          </section>

          {/* 최근 감상 작품 섹션 */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-t3 text-gray-90">최근 감상 작품</h2>
              <span className="text-bd2 text-gray-40">더보기</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentArtworks.map(art =>
                art.aiMessage ? (
                  <RecentArtworkWithAIMessage
                    key={art.id}
                    title={art.title}
                    imageUrl={art.imageUrl}
                    viewDate={art.viewDate}
                    conversationCount={art.conversationCount}
                    aiMessage={art.aiMessage}
                  />
                ) : (
                  <ArtworkCard
                    key={art.id}
                    title={art.title}
                    artist={art.artist}
                    imageUrl={art.imageUrl}
                    viewDate={art.viewDate}
                    conversationCount={art.conversationCount}
                  />
                ),
              )}
            </div>
          </section>

          {/* 취향 기반 탐색 섹션 */}
          <section className="flex flex-col gap-[1.6rem]">
            <div className="flex flex-col gap-[0.4rem]">
              <h2 className="text-t3 text-gray-90">취향 기반 탐색</h2>
              <span className="text-ct4 text-gray-50">
                당신의 감상 패턴을 분석한 추천 키워드
              </span>
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                {keywords.map(kw => (
                  <div
                    key={kw.id}
                    className={`px-[1.2rem] py-[0.8rem] rounded-[4px] flex justify-center items-center gap-2.5 ${
                      kw.isSelected
                        ? 'bg-gray-80 text-gray-0'
                        : 'bg-gray-0 text-gray-60'
                    }`}
                  >
                    <div className="justify-start text-ct3">{kw.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {tasteArtworks.map(art => (
                  <ArtworkCard
                    key={art.id}
                    title={art.title}
                    artist={art.artist}
                    imageUrl={art.imageUrl}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
