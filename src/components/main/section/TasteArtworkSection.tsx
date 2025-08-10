import ArtworkCard from '@/components/main/ArtworkCard';
import KeywordList from '@/components/main/KeywordList';
import { TasteArtworkSectionProps } from '@/types';

interface Props extends TasteArtworkSectionProps {
  isLoading?: boolean;
}

export default function TasteArtworkSection({
  keywords,
  artworks,
  isLoading = false,
}: Props) {
  const artworkSkeletonKeys = ['aw-1', 'aw-2', 'aw-3', 'aw-4', 'aw-5'];

  return (
    <section className="flex flex-col gap-[1.6rem]" aria-busy={isLoading}>
      <div className="flex flex-col gap-[0.4rem]">
        <h2 className="text-t3 text-gray-90">취향 기반 탐색</h2>
        <span className="text-ct4 text-gray-50">
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
            : artworks.map(art => (
                <ArtworkCard
                  key={art.id}
                  title={art.title}
                  artist={art.artist}
                  imageUrl={art.imageUrl}
                />
              ))}
        </div>

        {!isLoading && artworks.length === 0 && (
          <p className="px-[0.4rem] text-ct4 text-gray-50">
            표시할 작품이 없어요.
          </p>
        )}
      </div>
    </section>
  );
}
