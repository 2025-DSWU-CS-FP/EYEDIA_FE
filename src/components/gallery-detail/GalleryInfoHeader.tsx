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
    <div className="absolute left-[22px] top-[166px] inline-flex flex-col justify-start items-start gap-3">
      <div className="text-black text-2xl font-semibold leading-tight whitespace-pre-line">
        {insertLineBreak(title)}
      </div>

      <div className="w-70 flex flex-col justify-start items-start gap-1">
        <div className="justify-start text-stone-500 text-sm font-medium">
          {location}
        </div>
        <div className="self-stretch justify-start text-stone-500 text-xs font-medium">
          {date}
        </div>
      </div>
    </div>
  );
}
