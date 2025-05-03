import { ExhibitionCardProps } from '@/types';

export default function ExhibitionCard({
  imageUrl,
  title,
  location,
}: ExhibitionCardProps) {
  return (
    <div className="w-40 flex-shrink-0">
      <img
        src={imageUrl}
        alt={title}
        className="h-40 w-full rounded-sm object-cover"
      />
      <h3 className="w-32 justify-start text-black text-base font-medium leading-tight pt-2 pb-1">
        {title}
      </h3>
      <p className="w-32 justify-start text-neutral-400 text-xs font-medium">
        {location}
      </p>
    </div>
  );
}
