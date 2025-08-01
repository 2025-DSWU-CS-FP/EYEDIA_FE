import { RecentArtworkWithAIMessageProps } from '@/types';

export default function RecentArtworkWithAIMessage({
  title,
  viewDate,
  conversationCount,
  aiMessage,
  imageUrl,
}: RecentArtworkWithAIMessageProps) {
  return (
    <div className="flex min-w-[31.2rem] flex-col overflow-hidden rounded-[12px] bg-gray-0">
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

      <div className="flex items-start justify-between bg-gray-0 p-[1.6rem]">
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
