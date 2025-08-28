import ExhibitionCard from '@/components/main/ExhibitionCard';

interface Exhibition {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  artworkCount: number;
}

interface ExhibitionGridProps {
  exhibitions: Exhibition[];
  isLoading?: boolean;
  onSelect?: (id: number | string) => void;
}

export default function ExhibitionGrid({
  exhibitions,
  isLoading = false,
  onSelect,
}: ExhibitionGridProps) {
  return (
    <section
      className="mx-auto grid grid-cols-2 gap-x-[2.7rem] gap-y-[2.6rem] px-[2.4rem] py-[4rem]"
      aria-busy={isLoading}
    >
      {exhibitions.map(exh => (
        <ExhibitionCard
          key={exh.id}
          id={exh.id}
          title={exh.title}
          location={exh.location}
          imageUrl={exh.imageUrl}
          artworkCount={exh.artworkCount}
          isLoading={isLoading}
          onClick={onSelect}
        />
      ))}
    </section>
  );
}
