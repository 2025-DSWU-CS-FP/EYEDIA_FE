interface ArtworkCardProps {
  title: string;
  artist: string;
  imageUrl: string;
}

export default function ArtworkCard({
  title,
  artist,
  imageUrl,
}: ArtworkCardProps) {
  return (
    <div className="min-w-[21rem] flex flex-col gap-[0.8rem]">
      <img src={imageUrl} className="rounded-[12px]" alt={title} />
      <div className="flex flex-col justify-start items-start gap-1">
        <span className="text-gray-90 text-t5">{title}</span>
        <div className="text-gray-50 text-ct4 font-medium font-['Pretendard'] leading-none">
          {artist}
        </div>
      </div>
    </div>
  );
}
