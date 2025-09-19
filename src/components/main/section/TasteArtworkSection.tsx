import ArtworkCard from '@/components/main/ArtworkCard';
import KeywordList from '@/components/main/KeywordList';
import type { TasteArtworkSectionProps } from '@/types';

const PLACEHOLDER = '/assets/images/placeholder-artwork.png';

export default function TasteArtworkSection({
  keywords,
  artworks,
  isLoading = false,
}: TasteArtworkSectionProps) {
  const artworkSkeletonKeys = ['aw-1', 'aw-2', 'aw-3', 'aw-4', 'aw-5', 'aw-6'];

  return (
    <section className="flex flex-col gap-[1.6rem]" aria-busy={isLoading}>
      <div className="flex flex-col gap-[0.4rem]">
        <h2 className="text-gray-90 t3">취향 기반 탐색</h2>
        <span className="text-gray-50 ct4">
          당신의 감상 패턴을 분석한 추천 키워드
        </span>
      </div>

      <div className="flex flex-col gap-[2rem]">
        <KeywordList
          keywords={keywords}
          isLoading={isLoading}
          skeletonCount={6}
        />

        <div
          className="flex gap-[1.2rem] overflow-x-auto pb-[0.8rem]"
          aria-live="polite"
        >
          {isLoading
            ? artworkSkeletonKeys.map(key => (
                <ArtworkCard key={key} isLoading />
              ))
            : artworks.map(art => {
                const src =
                  ('thumbnailUrl' in art && art.thumbnailUrl) ||
                  ('imageUrl' in art && art.imageUrl) ||
                  PLACEHOLDER;

                return (
                  <ArtworkCard
                    key={art.id}
                    title={art.title}
                    artist={art.artist}
                    imageUrl={src}
                  />
                );
              })}
        </div>

        {!isLoading && artworks.length === 0 && (
          <p className="px-[0.4rem] text-gray-50 ct4">표시할 작품이 없어요.</p>
        )}
      </div>
    </section>
  );
}
