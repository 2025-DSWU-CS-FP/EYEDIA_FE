import { ExhibitionCardProps } from '@/types';
import cn from '@/utils/cn';

interface ExhibitionCardExtendedProps extends ExhibitionCardProps {
  className?: string;
  imageClassName?: string;
}

export default function ExhibitionCard({
  title,
  location,
  imageUrl,
  artworkCount,
  className = '',
  imageClassName = '',
}: ExhibitionCardExtendedProps) {
  return (
    <div
      className={cn(
        'group flex cursor-pointer flex-col items-start justify-start gap-[0.8rem]',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[12px]">
        <img
          className={cn(
            'aspect-[3/4] w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110',
            imageClassName,
          )}
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
