import { useEffect, useRef, useState } from 'react';
import '@/styles/chat-selection.css';

interface ChatMessageProps {
  text: string;
  isFromUser?: boolean;
}

function Marker() {
  return (
    <div className="absolute -top-[3px] -left-[4px] w-2.5 h-7 pointer-events-none">
      <div className="w-[2px] h-6 absolute left-[4.5px] top-0 bg-[#F68C8C]" />
      <div className="w-2.5 h-2.5 absolute left-0 top-0 bg-[#F68C8C] rounded-full" />
    </div>
  );
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

      const startOffset = text.indexOf(selectedText);
      if (startOffset === -1) return;

      setHighlightRange({
        start: startOffset,
        end: startOffset + selectedText.length,
      });
    };

    const handleClickOutside = () => {
      setHighlightRange(null);
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (!highlightRange) return;
      e.preventDefault();
      const copiedText = text.slice(highlightRange.start, highlightRange.end);
      e.clipboardData?.setData('text/plain', copiedText);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('copy', handleCopy);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('copy', handleCopy);
    };
  }, [text, highlightRange]);

  const renderText = () => {
    if (!highlightRange) return text;

    const { start, end } = highlightRange;

    return (
      <>
        {text.slice(0, start)}
        <span className="relative bg-rose-200/20 rounded px-0.5">
          <span className="absolute left-0">
            <Marker />
          </span>
          {text.slice(start, end)}
          <span className="absolute right-0">
            <Marker />
          </span>
        </span>
        {text.slice(end)}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`text-sm px-4 py-2 rounded whitespace-pre-wrap break-words max-w-[80%] select-text ${
        isFromUser
          ? 'self-end bg-white text-black'
          : 'bg-stone-50/10 text-white'
      }`}
    >
      {renderText()}
    </div>
  );
}
