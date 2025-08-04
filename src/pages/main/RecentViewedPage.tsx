import RecentArtwork from '@/components/main/RecentArtwork';
import Header from '@/layouts/Header';
import { recentArtworks } from '@/mock/mainData'; // 총 3개 있다고 가정

export default function RecentViewedPage() {
  return (
    <div className="flex min-h-screen w-full flex-col pb-8">
      <Header
        title="최근 감상 작품"
        backgroundColorClass="bg-gray-5"
        showBackButton
      />

      <div className="mt-[3.2rem] flex flex-col gap-[3rem] px-[2.4rem]">
        {recentArtworks.slice(0, 3).map(artwork => (
          <RecentArtwork
            key={artwork.id}
            title={artwork.title}
            viewDate={artwork.viewDate}
            conversationCount={artwork.conversationCount}
            aiMessage={artwork.aiMessage}
            imageUrl={artwork.imageUrl}
            useGradientBackground
          />
        ))}
      </div>
    </div>
  );
}
