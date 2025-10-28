import { useMemo } from 'react';

import Empty from '@/components/common/Empty';
import RecentArtwork from '@/components/main/RecentArtwork';
import Header from '@/layouts/Header';
import useScrapsByExhibition from '@/services/queries/useScrapsByExhibition';
import { ensureImage } from '@/utils/image';

export default function RecentViewedPage() {
  const { data, isFetching, isError } = useScrapsByExhibition();

  const items = useMemo(
    () =>
      (data ?? []).map(it => ({
        id: String(it.id),
        title: it.title ?? '제목 미상',
        viewDate: it.date,
        conversationCount: 0,
        aiMessage: it.excerpt,
        imageUrl: ensureImage(it.imageUrl),
      })),
    [data],
  );

  const skeletonKeys = useMemo(() => ['rv-1', 'rv-2', 'rv-3'], []);
  const isEmpty = !isFetching && !isError && items.length === 0;

  return (
    <main
      className="flex min-h-screen w-full flex-col pb-8"
      aria-busy={isFetching}
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
        {isFetching &&
          skeletonKeys.map(key => (
            <RecentArtwork key={key} isLoading useGradientBackground />
          ))}

        {!isFetching &&
          items.map(art => (
            <RecentArtwork
              key={art.id}
              title={art.title}
              viewDate={art.viewDate}
              conversationCount={art.conversationCount}
              aiMessage={art.aiMessage}
              imageUrl={art.imageUrl}
              useGradientBackground
            />
          ))}

        {isEmpty && (
          <div className="flex h-[50vh] justify-center px-[0.4rem] py-1">
            <Empty
              title="최근에 감상한 작품이 없어요"
              description="작품을 감상하면 여기에 보여드릴게요."
            />
          </div>
        )}

        {isError && (
          <div className="text-center text-red-500 ct3">
            목록을 불러오지 못했어요.
          </div>
        )}
      </section>
    </main>
  );
}
