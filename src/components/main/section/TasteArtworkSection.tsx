import ArtworkCard from '@/components/main/ArtworkCard';
import KeywordList from '@/components/main/KeywordList';

interface Keyword {
  id: string;
  label: string;
  isSelected: boolean;
}

interface TasteArtwork {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
}

interface TasteArtworkSectionProps {
  keywords: Keyword[];
  artworks: TasteArtwork[];
}

export default function TasteArtworkSection({
  keywords,
  artworks,
}: TasteArtworkSectionProps) {
  return (
    <section className="flex flex-col gap-[1.6rem]">
      <div className="flex flex-col gap-[0.4rem]">
        <h2 className="text-t3 text-gray-90">취향 기반 탐색</h2>
        <span className="text-ct4 text-gray-50">
          당신의 감상 패턴을 분석한 추천 키워드
        </span>
      </div>
      <div className="flex flex-col gap-[2rem]">
        <KeywordList keywords={keywords} />
        <div className="flex gap-[1.2rem] overflow-x-auto">
          {artworks.map(art => (
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
  );
}
