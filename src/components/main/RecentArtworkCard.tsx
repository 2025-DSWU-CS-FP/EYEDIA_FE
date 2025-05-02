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
        <p className="self-stretch justify-start text-white text-xs font-normal">
          {artist}
        </p>
        <p className="justify-start text-white text-base font-medium">
          {`${title}(${year})`}
        </p>
      </div>
      {onReplay && (
        <button
          type="button"
          className="absolute bottom-2 right-2 px-3 py-2 bg-black/70 hover:bg-black/50 rounded inline-flex justify-center items-center gap-3"
          onClick={onReplay}
        >
          <p className="justify-start text-white text-xs font-medium">
            대화 다시보기
          </p>
        </button>
      )}
    </div>
  );
}
