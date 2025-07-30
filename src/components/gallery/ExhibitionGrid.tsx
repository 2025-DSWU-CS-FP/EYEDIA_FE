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
}

export default function ExhibitionGrid({ exhibitions }: ExhibitionGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-[1.6rem] gap-y-[2.4rem] px-6 pt-4">
      {exhibitions.map(exh => (
        <ExhibitionCard
          key={exh.id}
          title={exh.title}
          location={exh.location}
          imageUrl={exh.imageUrl}
          artworkCount={exh.artworkCount}
        />
      ))}
    </div>
  );
}
