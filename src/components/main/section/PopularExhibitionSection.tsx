import { useNavigate } from 'react-router-dom';

import PopularExhibitionCard from '@/components/main/ExhibitionCard';
import SectionHeader from '@/components/main/SectionHeader';
import { PopularExhibitionSectionProps } from '@/types';

export default function PopularExhibitionSection({
  exhibitions,
}: PopularExhibitionSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="지금 인기 전시"
        onMoreClick={() => navigate('/exhibitions')}
      />
      <div className="flex gap-[1.2rem] overflow-x-auto pb-2">
        {exhibitions.map(exh => (
          <PopularExhibitionCard
            key={exh.id}
            title={exh.title}
            location={exh.location}
            imageUrl={exh.imageUrl}
            imageClassName="min-w-[15rem]"
          />
        ))}
      </div>
    </section>
  );
}
