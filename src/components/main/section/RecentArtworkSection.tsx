import { useNavigate } from 'react-router-dom';

import ArtworkCard from '@/components/main/ArtworkCard';
import RecentArtworkWithAIMessage from '@/components/main/RecentArtworkWithAIMessage';
import SectionHeader from '@/components/main/SectionHeader';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  viewDate: string;
  conversationCount: number;
  aiMessage?: string;
}

interface RecentArtworkSectionProps {
  artworks: Artwork[];
}

export default function RecentArtworkSection({
  artworks,
}: RecentArtworkSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="최근 감상 작품"
        onMoreClick={() => navigate('/recent')}
      />
      <div className="flex gap-[1.2rem] overflow-x-auto">
        {artworks.map(art =>
          art.aiMessage ? (
            <RecentArtworkWithAIMessage
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
    </section>
  );
}
