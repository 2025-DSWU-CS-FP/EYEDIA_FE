import { useEffect, useRef, useState } from 'react';

import SelectionActionMenu from '@/components/chat/SelectionActionMenu';
import '@/styles/chat-selection.css';

interface ChatMessageProps {
  text: string;
  isFromUser?: boolean;
  onExtract?: (quote: string) => void;
}

function Marker() {
  return (
    <div className="pointer-events-none absolute -left-[4px] -top-[3px] h-7 w-2.5">
      <div className="absolute left-[4.5px] top-0 h-6 w-[2px] bg-[#F68C8C]" />
      <div className="absolute left-0 top-0 h-2.5 w-2.5 rounded-full bg-[#F68C8C]" />
    </div>
  );
}

export default function ChatMessage({
  text,
  isFromUser = false,
  onExtract,
}: ChatMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [highlightRange, setHighlightRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
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

      const rects = range.getClientRects();
      const lastRect = rects[rects.length - 1];
      const containerRect = containerRef.current!.getBoundingClientRect();

      const startOffset = text.indexOf(selectedText);
      if (startOffset === -1) return;

      setHighlightRange({
        start: startOffset,
        end: startOffset + selectedText.length,
      });

      setMenuPosition({
        top: lastRect.bottom - containerRect.top + 4,
        left: lastRect.left - containerRect.left,
      });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }

      setHighlightRange(null);
      setMenuPosition(null);
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
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('copy', handleCopy);
      document.addEventListener('mousedown', handleClickOutside);
    };
  }, [text, highlightRange]);

  useEffect(() => {
    const handleTouchEnd = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();

      if (
        !selectedText.trim() ||
        !containerRef.current?.contains(range.startContainer)
      )
        return;

      const rects = range.getClientRects();
      const lastRect = rects[rects.length - 1];
      const containerRect = containerRef.current!.getBoundingClientRect();

      const startOffset = text.indexOf(selectedText);
      if (startOffset === -1) return;

      setHighlightRange({
        start: startOffset,
        end: startOffset + selectedText.length,
      });

      setMenuPosition({
        top: lastRect.bottom - containerRect.top + 4,
        left: lastRect.left - containerRect.left,
      });
    };

    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [text]);

  const renderText = () => {
    if (!highlightRange) return text;

    const { start, end } = highlightRange;

    return (
      <>
        {text.slice(0, start)}
        <span className="relative rounded bg-rose-200/20 px-0.5">
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
      className={`disable-native-selection relative max-w-[80%] select-text whitespace-pre-wrap break-words rounded-[8px] px-[1.4rem] py-[1rem] text-bd3 ${
        isFromUser
          ? 'self-end bg-brand-blue text-gray-0'
          : 'bg-gray-0 text-gray-90'
      }`}
    >
      {menuPosition && highlightRange && (
        <SelectionActionMenu
          top={menuPosition.top}
          left={menuPosition.left}
          menuRef={menuRef}
          onExtract={() => {
            const quote = text.slice(highlightRange.start, highlightRange.end);
            console.log('[ChatMessage] 발췌 텍스트:', quote);
            onExtract?.(quote);
            setHighlightRange(null);
            setMenuPosition(null);
          }}
          onCancel={() => {
            setHighlightRange(null);
            setMenuPosition(null);
          }}
        />
      )}
      {renderText()}
    </div>
  );
}
