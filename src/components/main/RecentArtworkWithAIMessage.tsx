import React from 'react';

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
    <div className="w-80 inline-flex flex-col justify-start items-start">
      <div className="w-80 h-36 relative rounded-tl-xl rounded-tr-xl overflow-hidden">
        <div className="w-80 h-64 left-0 top-[-0.50px] absolute bg-zinc-800/40" />
        <div className="left-[57.23px] top-[36px] absolute text-center justify-start text-white text-base font-semibold font-['Pretendard'] leading-snug">
          {aiMessage}
        </div>
        <div className="w-1.5 h-1.5 left-[265px] top-[61px] absolute bg-white rounded-full border-[0.44px] border-white" />
        <div className="w-1.5 h-1.5 left-[271.11px] top-[61px] absolute bg-white rounded-full border-[0.44px] border-white" />
        <div className="w-1 h-[3.27px] left-[265.59px] top-[65.36px] absolute bg-white outline outline-[0.44px] outline-offset-[-0.22px] outline-white" />
        <div className="w-1 h-[3.27px] left-[271.70px] top-[65.36px] absolute bg-white outline outline-[0.44px] outline-offset-[-0.22px] outline-white" />
        <div className="w-1.5 h-1.5 left-[59.35px] top-[43.21px] absolute bg-white rounded-full border-[0.44px] border-white" />
        <div className="w-1.5 h-1.5 left-[53.24px] top-[43.21px] absolute bg-white rounded-full border-[0.44px] border-white" />
        <div className="w-1 h-[3.27px] left-[58.75px] top-[45.61px] absolute bg-white outline outline-[0.44px] outline-offset-[-0.22px] outline-white" />
        <div className="w-1 h-[3.27px] left-[52.64px] top-[45.61px] absolute bg-white outline outline-[0.44px] outline-offset-[-0.22px] outline-white" />
        <div className="left-[128.69px] top-[89.91px] absolute justify-start text-white text-xs font-medium font-['Pretendard'] leading-none">
          -AI의 메세지
        </div>
      </div>
      <div className="w-80 p-4 bg-white rounded-bl-xl rounded-br-xl inline-flex justify-between items-start">
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch justify-center text-zinc-900 text-base font-bold font-['Pretendard'] leading-snug">
            {title}
          </div>
          <div className="self-stretch justify-center text-neutral-400 text-xs font-medium font-['Pretendard'] leading-none">
            {viewDate}
          </div>
        </div>
        <div className="px-2 py-1 bg-gray-200 rounded flex justify-center items-center gap-2.5">
          <div className="text-center justify-center text-zinc-500 text-xs font-medium font-['Pretendard']">
            {conversationCount}건의 대화
          </div>
        </div>
      </div>
    </div>
  );
} 