interface ChatMessageProps {
  text: string;
  isFromUser?: boolean;
}

export default function ChatMessage({
  text,
  isFromUser = false,
}: ChatMessageProps) {
  return (
    <div
      className={`text-sm px-4 py-2 rounded whitespace-pre-wrap break-words max-w-[80%] ${
        isFromUser
          ? 'self-end bg-white text-black'
          : 'bg-stone-50/10 text-white'
      }`}
    >
      {text}
    </div>
  );
}
