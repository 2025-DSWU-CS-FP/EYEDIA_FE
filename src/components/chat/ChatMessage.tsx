import { useEffect, useRef, useState } from 'react';
import '@/styles/chat-selection.css';

interface ChatMessageProps {
  text: string;
  isFromUser?: boolean;
}

export default function ChatMessage({
  text,
  isFromUser = false,
}: ChatMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightRange, setHighlightRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  // ✅ 드래그해서 하이라이트 생성
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();

      if (
        !selectedText.trim() ||
        !containerRef.current?.contains(range.startContainer)
      )
        return;

      const fullText = text;
      const startOffset = fullText.indexOf(selectedText);
      if (startOffset === -1) return;

      setHighlightRange({
        start: startOffset,
        end: startOffset + selectedText.length,
      });

      // 👉 선택 영역 유지할 필요 없음 → 초기화 안 함
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [text]);

  useEffect(() => {
    const handleMouseDown = () => {
      setHighlightRange(null);
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const renderText = () => {
    if (!highlightRange) return text;

    const { start, end } = highlightRange;
    return (
      <>
        {text.slice(0, start)}
        <span className="highlight-word relative">
          {text.slice(start, end)}
        </span>
        {text.slice(end)}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`text-sm px-4 py-2 rounded whitespace-pre-wrap break-words max-w-[80%] ${
        isFromUser
          ? 'self-end bg-white text-black'
          : 'bg-stone-50/10 text-white'
      }`}
    >
      {renderText()}
    </div>
  );
}
