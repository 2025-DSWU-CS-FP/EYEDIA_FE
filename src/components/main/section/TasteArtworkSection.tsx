import ArtworkCard from '@/components/main/ArtworkCard';
import KeywordList from '@/components/main/KeywordList';
import type { TasteArtworkSectionProps } from '@/types';

const PLACEHOLDER = '/assets/images/placeholder-artwork.png';

const KO_LABEL_MAP: Record<string, string> = {
  ANCIENT: '고대/고전',
  RENAISSANCE: '르네상스',
  MODERN: '근대',
  CONTEMPORARY: '현대 (20c 중반 이후)',
  WARM: '따뜻한 색감',
  COOL: '차가운 색감',
  MONOTONE: '모노톤/무채색',
  PASTEL: '파스텔톤',
  HEALING: '힐링되는',
  HUMOROUS: '유머러스한',
  EMOTIONAL: '감성적인',
  CALM: '차분한',
  PASSIONATE: '정열적인',
  INTERACTIVE: '인터랙티브한',
  OBSERVATIONAL: '관찰을 유도하는',
  REPETITIVE: '반복적인',
  SCARY: '무서운',
};

export default function TasteArtworkSection({
  keywords,
  artworks,
  isLoading = false,
  onKeywordSelect,
}: TasteArtworkSectionProps) {
  const artworkSkeletonKeys = ['aw-1', 'aw-2', 'aw-3', 'aw-4', 'aw-5', 'aw-6'];

  const normalized = keywords.map(k => {
    const label = k.label?.trim();
    const ko = KO_LABEL_MAP[k.id] ?? label ?? k.id;
    return { ...k, label: ko };
  });

  const hasSelected = normalized.some(k => k.isSelected);
  const displayKeywords = hasSelected
    ? normalized
    : normalized.map((k, i) => (i === 0 ? { ...k, isSelected: true } : k));

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
          keywords={displayKeywords}
          isLoading={isLoading}
          skeletonCount={6}
          onSelect={(id: string) => onKeywordSelect?.(id)}
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
