import PopularExhibitionCard from '@/components/main/ExhibitionCard';
import SectionHeader from '@/components/main/SectionHeader';

interface PopularExhibitionItem {
  id: number | string;
  title: string;
  location: string;
  imageUrl: string;
}

interface PopularExhibitionSectionProps {
  exhibitions: PopularExhibitionItem[];
  isLoading?: boolean;
  onMoreClick?: () => void;
  onSelect?: (id: number | string) => void;
}

export default function PopularExhibitionSection({
  exhibitions,
  isLoading = false,
  onMoreClick,
  onSelect,
}: PopularExhibitionSectionProps) {
  const skeletonKeys = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'];

  return (
    <section className="flex flex-col gap-[1rem]" aria-busy={isLoading}>
      <SectionHeader title="지금 인기 전시" onMoreClick={onMoreClick} />

      <div
        className="flex gap-[1.2rem] overflow-x-auto pb-[0.8rem]"
        aria-live="polite"
      >
        {isLoading
          ? skeletonKeys.map(key => (
              <PopularExhibitionCard
                key={key}
                isLoading
                imageClassName="min-w-[15rem]"
                id={key}
                title=""
                location=""
                imageUrl=""
              />
            ))
          : exhibitions.map(exh => (
              <PopularExhibitionCard
                key={exh.id}
                id={exh.id}
                title={exh.title}
                location={exh.location}
                imageUrl={exh.imageUrl}
                imageClassName="min-w-[15rem]"
                isLoading={false}
                onClick={onSelect}
              />
            ))}
      </div>

      {!isLoading && exhibitions.length === 0 && (
        <p className="px-[0.4rem] text-gray-50 ct4">표시할 전시가 없어요.</p>
      )}
    </section>
  );
}
