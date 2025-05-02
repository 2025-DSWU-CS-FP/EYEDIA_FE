interface RecentArtworkCardProps {
  imageUrl: string;
  artist: string;
  title: string;
  year: string;
  onReplay?: () => void;
}

export default function RecentArtworkCard({
  imageUrl,
  artist,
  title,
  year,
  onReplay,
}: RecentArtworkCardProps) {
  return (
    <div className="relative w-full">
      <img
        src={imageUrl}
        alt={title}
        className="h-52 w-full rounded-md object-cover"
      />
      <div className="absolute bottom-2 left-2 text-white">
        <p className="text-sm">{artist}</p>
        <p className="font-semibold">{`${title}(${year})`}</p>
      </div>
      {onReplay && (
        <button
          type="button"
          className="absolute bottom-2 right-2 rounded bg-white px-2 py-1 text-xs text-black"
          onClick={onReplay}
        >
          대화 다시보기
        </button>
      )}
    </div>
  );
}
