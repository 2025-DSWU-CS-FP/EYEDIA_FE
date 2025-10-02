import ChatMessage from '@/components/chat/ChatMessage';
import type { LocalMsg } from '@/types/chatLocal';

type Message = {
  id: string;
  sender: 'USER' | 'BOT' | 'SYSTEM';
  type: 'TEXT' | 'IMAGE';
  content?: string;
  imageUrl?: string;
};

type Props = {
  initial: Message[];
  wsList: Message[];
  localMessages: LocalMsg[];
  typing: boolean;
  onExtract: (quote: string) => void;
  listRef: React.RefObject<HTMLDivElement>;
  endRef: React.RefObject<HTMLDivElement>;
};

export default function MessageList({
  initial,
  wsList,
  localMessages,
  typing,
  onExtract,
  listRef,
  endRef,
}: Props) {
  return (
    <div
      ref={listRef}
      className="flex h-full flex-col gap-[1.2rem] overflow-y-auto px-[1.8rem] pt-8"
    >
      {[...initial, ...wsList, ...localMessages].map(m =>
        m.type === 'IMAGE' ? (
          <figure
            key={m.id}
            className="max-w-[75%] self-end overflow-hidden rounded-[20px] bg-gray-10"
          >
            <img
              src={m.imageUrl!}
              alt="선택한 부분 이미지"
              className="block h-auto w-full object-cover"
            />
          </figure>
        ) : (
          <ChatMessage
            key={m.id}
            text={m.content!}
            isFromUser={m.sender === 'USER'}
            onExtract={onExtract}
          />
        ),
      )}
      {typing && (
        <div className="flex items-start gap-[1rem]">
          <div className="rounded-[20px] bg-gray-10 px-[1.2rem] py-[0.8rem]">
            <span className="sr-only">상대가 입력 중…</span>
            <div className="flex items-end gap-[0.4rem]">
              <span className="typing-dot" />
              <span className="typing-dot delay-1" />
              <span className="typing-dot delay-2" />
            </div>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
