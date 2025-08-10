import { useNavigate } from 'react-router-dom';

import ArtworkCard from '@/components/main/ArtworkCard';
import RecentArtwork from '@/components/main/RecentArtwork';
import SectionHeader from '@/components/main/SectionHeader';
import { RecentArtworkSectionProps } from '@/types';

interface Props extends RecentArtworkSectionProps {
  isLoading?: boolean;
}

export default function RecentArtworkSection({
  artworks,
  isLoading = false,
}: Props) {
  const navigate = useNavigate();

  const skeletonKeys = ['sk-ra-1', 'sk-ra-2', 'sk-ra-3', 'sk-ra-4', 'sk-ra-5'];

  return (
    <section className="flex flex-col gap-[1rem]" aria-busy={isLoading}>
      <SectionHeader
        title="최근 감상 작품"
        onMoreClick={() => navigate('/recent-viewed')}
      />

      <div
        className="flex gap-[1.2rem] overflow-x-auto pb-[0.8rem]"
        aria-live="polite"
      >
        {isLoading
          ? skeletonKeys.map(key => (
              <div key={key} className="min-w-[31.2rem]">
                <div className="relative overflow-hidden rounded-[12px]">
                  <div className="animate-pulse h-[15rem] w-full bg-gray-10" />
                </div>
                <div className="mt-[0.8rem] flex flex-col gap-[0.4rem]">
                  <div className="animate-pulse h-[2rem] w-3/4 rounded-[6px] bg-gray-20" />
                  <div className="animate-pulse h-[1.6rem] w-1/2 rounded-[6px] bg-gray-20" />
                </div>
                <span className="sr-only">최근 감상 작품을 불러오는 중…</span>
              </div>
            ))
          : artworks.map(art =>
              art.aiMessage ? (
                <RecentArtwork
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
                />
              ),
            )}
      </div>

      {!isLoading && artworks.length === 0 && (
        <p className="px-[0.4rem] text-ct4 text-gray-50">
          표시할 작품이 없어요.
        </p>
      )}
    </section>
  );
}
