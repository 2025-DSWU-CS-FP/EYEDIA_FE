import insertLineBreak from '@/utils/insertLineBreak';

interface GalleryInfoHeaderProps {
  title: string;
  location: string;
  date: string;
}

export default function GalleryInfoHeader({
  title,
  location,
  date,
}: GalleryInfoHeaderProps) {
  return (
    <div className="absolute left-[22px] top-[166px] inline-flex flex-col items-start justify-start gap-3">
      <div className="whitespace-pre-line text-2xl font-semibold leading-tight text-black">
        {insertLineBreak(title)}
      </div>

      <div className="w-70 flex flex-col items-start justify-start gap-1">
        <div className="justify-start text-sm font-medium text-stone-500">
          {location}
        </div>
        <div className="justify-start self-stretch text-xs font-medium text-stone-500">
          {date}
        </div>
      </div>
    </div>
  );
}
