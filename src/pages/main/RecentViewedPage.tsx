import { useEffect, useMemo, useState } from 'react';

import RecentArtwork from '@/components/main/RecentArtwork';
import Header from '@/layouts/Header';
import { recentArtworks } from '@/mock/mainData';

export default function RecentViewedPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const skeletonKeys = useMemo(() => ['rv-1', 'rv-2', 'rv-3'], []);

  return (
    <main
      className="flex min-h-screen w-full flex-col pb-8"
      aria-busy={isLoading}
    >
      <Header
        title="최근 감상 작품"
        backgroundColorClass="bg-gray-5"
        showBackButton
      />

      <section
        className="mt-[3.2rem] flex flex-col gap-[3rem] px-[3rem]"
        aria-live="polite"
      >
        {isLoading
          ? skeletonKeys.map(key => (
              <RecentArtwork key={key} isLoading useGradientBackground />
            ))
          : recentArtworks
              .slice(0, 3)
              .map(artwork => (
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
      </section>
    </main>
  );
}
