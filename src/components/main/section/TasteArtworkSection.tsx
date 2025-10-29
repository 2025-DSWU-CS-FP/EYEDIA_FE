import ArtworkCard from '@/components/main/ArtworkCard';
import KeywordList from '@/components/main/KeywordList';
import type { TasteArtworkSectionProps } from '@/types';

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

type ExhibitionItem = {
  id: number | string;
  title: string;
  artist: string;
  location?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
};

type GroupedByKeyword = {
  keyword: string;
  exhibitions: ExhibitionItem[];
};

function isGrouped(data: unknown[]): data is GroupedByKeyword[] {
  if (!Array.isArray(data) || data.length === 0) return false;
  const x = data[0] as unknown;
  return (
    typeof x === 'object' &&
    x !== null &&
    'exhibitions' in (x as Record<string, unknown>)
  );
}

type ExhibitionView = {
  id: number | string;
  title: string;
  artist: string;
  thumbnailUrl?: string;
  imageUrl: string;
};

export default function TasteArtworkSection({
  keywords,
  artworks,
  isLoading = false,
  onKeywordSelect,
}: TasteArtworkSectionProps) {
  const normalized = keywords.map(k => {
    const label = k.label?.trim();
    const ko = KO_LABEL_MAP[k.id] ?? label ?? k.id;
    return { ...k, label: ko };
  });

  const hasSelected = normalized.some(k => k.isSelected);
  const displayKeywords = hasSelected
    ? normalized
    : normalized.map((k, i) => (i === 0 ? { ...k, isSelected: true } : k));

  const selectedId =
    displayKeywords.find(k => k.isSelected)?.id ?? displayKeywords[0]?.id ?? '';

  const flatItems: ExhibitionItem[] = (() => {
    if (isGrouped(artworks as unknown[])) {
      const groups = artworks as unknown as GroupedByKeyword[];
      const hit = groups.find(g => g.keyword === selectedId) ?? groups[0];
      return hit?.exhibitions ?? [];
    }
    return artworks as unknown as ExhibitionItem[];
  })();

  const viewItems: ExhibitionView[] = flatItems.map(it => ({
    id: it.id,
    title: it.title,
    artist: it.artist,
    thumbnailUrl: it.thumbnailUrl,
    imageUrl: it.imageUrl ?? it.thumbnailUrl ?? '',
  }));

  return (
    <section
      className="flex h-full min-h-[33rem] flex-col gap-[1.6rem]"
      aria-busy={isLoading}
    >
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
          {viewItems.map(ex => {
            const src = ex.thumbnailUrl?.trim().length
              ? ex.thumbnailUrl
              : ex.imageUrl;
            return (
              <ArtworkCard
                key={ex.id}
                title={ex.title}
                artist={ex.artist}
                imageUrl={src}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
