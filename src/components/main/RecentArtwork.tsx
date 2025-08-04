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

  const textClass = useGradientBackground ? 'text-gray-0' : 'text-gray-100';

  return (
    <div className="relative h-[22rem] min-w-[31.2rem] overflow-hidden rounded-[12px]">
      <img src={imageUrl} alt={title} className="h-full w-full object-cover" />

      <div className="absolute inset-0 bg-zinc-800/40" />

      <div className="absolute left-0 right-0 top-[3rem] z-10 flex flex-col items-center gap-[1rem] px-6">
        <p className="max-w-[30rem] text-center text-t5 font-semibold leading-[2.5rem] text-gray-0">
          <span>❝ </span>
          {aiMessage}
          <span> ❞</span>
        </p>
        <span className="text-ct4 text-gray-0">-AI의 메세지</span>
      </div>

      <div
        className={`absolute bottom-0 left-0 z-10 w-full ${backgroundClass} flex items-start justify-between px-[1.6rem] py-[1.6rem]`}
      >
        <div className="z-10 flex flex-1 flex-col gap-[0.4rem]">
          <span className={`text-t5 ${textClass}`}>{title}</span>
          <span className="text-ct5 font-medium text-gray-40">{viewDate}</span>
        </div>
        <div className="z-10 flex items-center rounded-[4px] bg-gray-10 px-[0.8rem] py-[0.4rem] text-ct4 text-gray-50">
          {conversationCount}건의 대화
        </div>
      </div>
    </div>
  );
}
