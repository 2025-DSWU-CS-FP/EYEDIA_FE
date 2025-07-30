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
    <div className="absolute left-[22px] top-[166px] flex flex-col gap-3">
      <div className="whitespace-pre-line text-2xl font-semibold leading-loose text-black">
        {title}
      </div>
      <div className="flex flex-col gap-px text-stone-500">
        <div className="text-sm font-medium">{location}</div>
        <div className="text-xs font-medium">{date}</div>
      </div>
    </div>
  );
}
