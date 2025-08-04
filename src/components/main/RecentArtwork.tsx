import { RecentArtworkProps } from '@/types';

export default function RecentArtwork({
  title,
  viewDate,
  conversationCount,
  aiMessage,
  imageUrl,
  useGradientBackground,
}: RecentArtworkProps) {
  const backgroundClass = useGradientBackground
    ? 'bg-gradient-to-b from-black/0 to-black'
    : 'bg-gray-0';
  return (
    <div className="flex min-w-[31.2rem] flex-col overflow-hidden rounded-[12px]">
      <div className="relative flex h-[15rem] w-full items-center justify-center bg-gray-900">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-800/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[1.2rem] px-6">
          <div className="text-center text-t5 font-semibold leading-snug text-gray-0">
            <span>❝ </span>
            {aiMessage}
            <span> ❞</span>
          </div>
          <span className="mt-2 text-ct4 text-gray-0">-AI의 메세지</span>
        </div>
      </div>

      <div
        className={`flex items-start justify-between p-[1.6rem] ${backgroundClass}`}
      >
        <div className="flex flex-1 flex-col gap-[0.4rem]">
          <span className="text-t5 text-gray-90">{title}</span>
          <span className="text-ct5 font-medium text-gray-40">{viewDate}</span>
        </div>
        <div className="flex items-center rounded-[4px] bg-gray-10 px-[0.8rem] py-[0.4rem] text-ct4 text-gray-50">
          {conversationCount}건의 대화
        </div>
      </div>
    </div>
  );
}
