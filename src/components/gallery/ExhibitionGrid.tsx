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
    <div className="mx-auto grid grid-cols-2 gap-x-[2.7rem] gap-y-[2.6rem] pt-[4rem]">
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
