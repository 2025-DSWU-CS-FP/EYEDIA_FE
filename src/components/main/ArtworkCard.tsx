interface ArtworkCardProps {
  title: string;
  artist: string;
  imageUrl: string;
  viewDate?: string;
  conversationCount?: number;
}

export default function ArtworkCard({
  title,
  artist,
  imageUrl,
  viewDate,
  conversationCount,
}: ArtworkCardProps) {
  return (
    <div className="w-52 inline-flex flex-col justify-start items-start gap-2">
      <img src={imageUrl} className="w-52 h-36 rounded-xl" alt={title} />
      <div className="w-20 flex flex-col justify-start items-start gap-1">
        <div className="justify-center text-zinc-900 text-base font-bold font-['Pretendard'] leading-snug">
          {title}
        </div>
        <div className="self-stretch justify-center text-neutral-400 text-xs font-medium font-['Pretendard'] leading-none">
          {artist}
        </div>
        {viewDate && (
          <div className="self-stretch justify-center text-neutral-400 text-xs font-medium font-['Pretendard'] leading-none">
            {viewDate}
          </div>
        )}
        {conversationCount && (
          <div className="px-2 py-1 bg-gray-200 rounded flex justify-center items-center gap-2.5">
            <div className="text-center justify-center text-zinc-500 text-xs font-medium font-['Pretendard']">
              {conversationCount}건의 대화
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
