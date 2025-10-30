import { useMemo, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import Empty from '@/components/common/Empty';
import ArtworkCard from '@/components/main/ArtworkCard';
import RecentArtwork from '@/components/main/RecentArtwork';
import SectionHeader from '@/components/main/SectionHeader';
import useScrapsByExhibition from '@/services/queries/useScrapsByExhibition';
import type { RecentArtworkSectionProps } from '@/types';
import redirectToLogin from '@/utils/authRedirect';
import { ensureImage } from '@/utils/image';

type Props = {
  artworks?: RecentArtworkSectionProps['artworks'];
  isLoading?: boolean;
};

type Item = NonNullable<RecentArtworkSectionProps['artworks']>[number];

const truncate = (text: string | undefined, max = 150): string | undefined => {
  if (!text) return text;
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

const displayLocation = (loc?: string): string =>
  loc === 'The_Met' ? 'The Metropolitan Museum of Art' : (loc ?? '제목 미상');

const MAX_SHOW = 3;

export default function RecentArtworkSection({
  artworks,
  isLoading: loadingProp = false,
}: Props) {
  const navigate = useNavigate();

  const useApi = artworks === undefined;
  const { data, isFetching, isError } = useScrapsByExhibition();

  const apiItems = useMemo<Item[]>(
    () =>
      (data ?? []).slice(0, MAX_SHOW).map(it => ({
        id: String(it.id),
        title: displayLocation(it.location),
        artist: it.artist ?? '작가 미상',
        imageUrl: ensureImage(it.imageUrl),
        viewDate: it.date,
        conversationCount: 0,
        aiMessage: truncate(it.excerpt, 143),
      })),
    [data],
  );

  useEffect(() => {
    if (isError && !data) {
      redirectToLogin();
    }
  }, [isError, data]);

  const providedItems = useMemo<Item[]>(
    () => (artworks ?? []).slice(0, MAX_SHOW),
    [artworks],
  );

  const list: Item[] = useApi ? apiItems : providedItems;
  const isLoading = useApi ? isFetching : loadingProp;
  const isEmpty = !isLoading && list.length === 0;

  const skeletonKeys = ['sk-ra-1', 'sk-ra-2', 'sk-ra-3'];

  const renderItem = (art: Item) =>
    art.aiMessage ? (
      <RecentArtwork
        key={art.id}
        title={art.title}
        imageUrl={art.imageUrl}
        viewDate={art.viewDate}
        conversationCount={art.conversationCount ?? 0}
        aiMessage={art.aiMessage}
      />
    ) : (
      <ArtworkCard
        key={art.id}
        title={art.title}
        artist={art.artist ?? '작가 미상'}
        imageUrl={art.imageUrl}
      />
    );

  return (
    <section className="flex flex-col gap-[1rem]" aria-busy={isLoading}>
      <SectionHeader
        title="최근 감상 작품"
        onMoreClick={() => navigate('/recent-viewed')}
      />

      {isEmpty ? (
        <div className="flex h-[22.8rem] justify-center px-[0.4rem] py-1">
          <Empty
            title="최근에 감상한 작품이 없어요"
            description="작품을 감상하면 여기에 보여드릴게요."
          />
        </div>
      ) : (
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
            : list.map(renderItem)}
        </div>
      )}
    </section>
  );
}
