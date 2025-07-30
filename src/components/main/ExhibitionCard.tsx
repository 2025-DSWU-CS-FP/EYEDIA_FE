interface ExhibitionCardProps {
  title: string;
  location: string;
  imageUrl: string;
}

export default function ExhibitionCard({
  title,
  location,
  imageUrl,
}: ExhibitionCardProps) {
  return (
    <div className="flex flex-col justify-start items-start gap-[0.8rem]">
      <img
        className="self-stretch min-w-[15rem] h-[18rem] rounded-[12px]"
        src={imageUrl}
        alt={title}
      />
      <div className="self-stretch flex flex-col justify-start items-start gap-1">
        <div className="self-stretch justify-start text-zinc-900 text-base font-bold font-['Pretendard'] leading-snug">
          {title}
        </div>
        <div className="self-stretch justify-start text-gray-50 text-ct4">
          {location}
        </div>
      </div>
    </div>
  );
}
