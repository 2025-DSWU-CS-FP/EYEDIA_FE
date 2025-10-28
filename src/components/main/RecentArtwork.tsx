import type { RecentArtworkProps } from '@/types';

export default function RecentArtwork({
  title,
  viewDate,
  aiMessage,
  imageUrl,
  useGradientBackground,
  isLoading,
}: RecentArtworkProps) {
  if (isLoading) {
    return (
      <div
        className="relative h-[22rem] min-w-[31.2rem] overflow-hidden rounded-[12px]"
        aria-busy="true"
        role="status"
        aria-live="polite"
      >
        <div className="animate-pulse h-full w-full bg-gray-10" />

        <div className="absolute left-0 right-0 top-[3rem] z-10 flex flex-col items-center gap-[1rem] px-6">
          <div className="animate-pulse h-[4.8rem] w-4/5 rounded-[6px] bg-gray-20" />
          <div className="animate-pulse h-[1.6rem] w-[8rem] rounded-[6px] bg-gray-20" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-start justify-between px-[1.6rem] py-[1.6rem]">
          <div className="flex flex-1 flex-col gap-[0.4rem]">
            <div className="animate-pulse h-[2rem] w-1/2 rounded-[6px] bg-gray-20" />
            <div className="animate-pulse h-[1.2rem] w-[6rem] rounded-[6px] bg-gray-20" />
          </div>
          <div className="animate-pulse h-[2.4rem] w-[9rem] rounded-[4px] bg-gray-20" />
        </div>
      </div>
    );
  }

  const backgroundClass = useGradientBackground
    ? 'bg-gradient-to-b from-black/0 to-black'
    : 'bg-gray-0';
  const textClass = useGradientBackground ? 'text-gray-0' : 'text-gray-100';

  return (
    <div className="relative h-[22rem] min-w-[31.2rem] overflow-hidden rounded-[12px]">
      <img src={imageUrl} alt={title} className="h-full w-full object-cover" />

      <div className="absolute inset-0 bg-zinc-800/40" />

      <div className="absolute left-0 right-0 top-[3rem] z-10 flex flex-col items-center gap-[1rem] px-6">
        <p className="max-w-[30rem] text-center font-semibold leading-[2.5rem] text-gray-0 ct2">
          <span>❝ </span>
          {aiMessage}
          <span> ❞</span>
        </p>
      </div>

      <div
        className={`absolute bottom-0 left-0 z-10 w-full ${backgroundClass} flex items-start justify-between px-[1.6rem] py-[1.6rem]`}
      >
        <div className="z-10 flex flex-1 flex-col gap-[0.4rem]">
          <span className={`t5 ${textClass}`}>{title}</span>
          <span className="font-medium text-gray-40 ct5">{viewDate}</span>
        </div>
      </div>
    </div>
  );
}
