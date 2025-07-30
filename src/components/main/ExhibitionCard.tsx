import { ExhibitionCardProps } from '@/types';

export default function ExhibitionCard({
  title,
  location,
  imageUrl,
  artworkCount,
}: ExhibitionCardProps) {
  return (
    <div className="flex flex-col items-start justify-start gap-[0.8rem]">
      <div className="relative">
        <img
          className="aspect-[3/4] w-full rounded-[12px] object-cover"
          src={imageUrl}
          alt={title}
        />
        {artworkCount !== undefined && (
          <span className="absolute bottom-[0.8rem] right-[0.8rem] rounded-[4px] bg-gray-0 px-[0.8rem] py-[0.4rem] text-ct4 text-gray-90">
            {artworkCount}개 작품
          </span>
        )}
      </div>
      <div className="flex flex-col items-start justify-start gap-1">
        <div className="text-t5 text-gray-90">{title}</div>
        <div className="text-ct4 text-gray-50">{location}</div>
      </div>
    </div>
  );
}
