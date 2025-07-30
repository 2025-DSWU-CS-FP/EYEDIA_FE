interface RecentArtworkWithAIMessageProps {
  title: string;
  viewDate: string;
  conversationCount: number;
  aiMessage: string;
  imageUrl: string;
}

export default function RecentArtworkWithAIMessage({
  title,
  viewDate,
  conversationCount,
  aiMessage,
  imageUrl,
}: RecentArtworkWithAIMessageProps) {
  return (
    <div className="min-w-[31.2rem] rounded-2xl overflow-hidden bg-white shadow flex flex-col">
      {/* 이미지 + 오버레이 + AI 메시지 */}
      <div className="relative w-full h-[15rem] flex items-center justify-center bg-black">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-800/40" />
        <div className="absolute inset-0 flex flex-col gap-[1.2rem] items-center justify-center px-6">
          <div className="text-gray-0 text-t5 font-semibold text-center leading-snug">
            <span>❝ </span>
            {aiMessage}
            <span> ❞</span>
          </div>
          <span className="mt-2 text-gray-0 text-ct4">-AI의 메세지</span>
        </div>
      </div>
      {/* 하단 정보 */}
      <div className="flex items-start justify-between p-[1.6rem] bg-white">
        <div className="flex-1 flex flex-col gap-[0.4rem]">
          <span className="text-ct5 text-gray-90 font-bold">{title}</span>
          <span className="text-ct5 text-gray-40 font-medium">{viewDate}</span>
        </div>
        <div className="px-[0.8rem] py-[0.4rem] bg-gray-10 rounded-[4px] text-gray-50 text-ct4flex items-center">
          {conversationCount}건의 대화
        </div>
      </div>
    </div>
  );
}
