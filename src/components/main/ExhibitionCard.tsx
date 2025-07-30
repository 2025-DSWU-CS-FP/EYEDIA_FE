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
    <div className="flex flex-col items-start justify-start gap-[0.8rem]">
      <img
        className="h-[18rem] min-w-[15rem] self-stretch rounded-[12px]"
        src={imageUrl}
        alt={title}
      />
      <div className="flex flex-col items-start justify-start gap-1 self-stretch">
        <div className="justify-start self-stretch text-t5 text-gray-90">
          {title}
        </div>
        <div className="justify-start self-stretch text-ct4 text-gray-50">
          {location}
        </div>
      </div>
    </div>
  );
}
