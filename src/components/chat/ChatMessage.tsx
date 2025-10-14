import { useEffect, useRef, useState, useCallback } from 'react';

import SelectionActionMenu from '@/components/chat/SelectionActionMenu';
import '@/styles/chat-selection.css';

interface ChatMessageProps {
  text: string;
  isFromUser?: boolean;
  onExtract?: (quote: string) => void;
}

export default function ChatMessage({
  text,
  isFromUser = false,
  onExtract,
}: ChatMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [menu, setMenu] = useState<{
    top: number;
    left: number;
    quote: string;
  } | null>(null);

  const selectingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hidden = !isFromUser && text.trim().length === 0;

  const isSelectionInside = useCallback(
    (sel: Selection | null): sel is Selection => {
      if (!sel || sel.isCollapsed) return false;
      const container = containerRef.current;
      if (!container) return false;
      const a = sel.anchorNode;
      const f = sel.focusNode;
      return !!(a && f && container.contains(a) && container.contains(f));
    },
    [],
  );

  const updateMenuFromSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!isSelectionInside(sel)) {
      setMenu(null);
      return;
    }
    const range = sel.getRangeAt(0);
    const rects = range.getClientRects();
    const container = containerRef.current;
    if (!rects.length || !container) return;

    const lastRect = rects[rects.length - 1];
    const cRect = container.getBoundingClientRect();

    const quote = sel.toString().trim();
    if (!quote) {
      setMenu(null);
      return;
    }

    const top = lastRect.bottom - cRect.top + 6;
    const leftRaw = lastRect.left - cRect.left;
    const left = Math.max(8, Math.min(leftRaw, cRect.width - 120));

    setMenu({ top, left, quote });
  }, [isSelectionInside]);

  const scheduleUpdate = useCallback(
    (delay = 60) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(updateMenuFromSelection);
      }, delay);
    },
    [updateMenuFromSelection],
  );

  useEffect(() => {
    if (hidden) {
      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        if (timerRef.current !== null) clearTimeout(timerRef.current);
      };
    }

    const onSelectionChange: EventListener = () => {
      if (!selectingRef.current) return;
      scheduleUpdate(0);
    };

    const onPointerDown: EventListener = e => {
      const target = e.target as Node | null;
      const inContainer = !!(target && containerRef.current?.contains(target));
      const inMenu = !!(target && menuRef.current?.contains(target));
      if (inMenu) return;

      if (inContainer) {
        selectingRef.current = true;
      } else {
        selectingRef.current = false;
        setMenu(null);
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed) sel.removeAllRanges();
      }
    };

    const finishSelection = () => {
      selectingRef.current = false;
      scheduleUpdate(80);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift' || e.key.startsWith('Arrow')) scheduleUpdate(0);
    };

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointerup', finishSelection);
    document.addEventListener('mouseup', finishSelection);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', finishSelection);
      document.removeEventListener('mouseup', finishSelection);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [hidden, scheduleUpdate]);

  const toRichHTML = useCallback((value: string) => {
    const escape = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let s = escape(value);
    s = s.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([\s\S]+?)__/g, '<strong>$1</strong>');
    s = s.replace(
      /(^|[^*])\*([^*\n]+?)\*/g,
      (_m, p1, p2) => `${p1}<strong>${p2}</strong>`,
    );
    s = s.replace(/\r?\n/g, '<br/>');
    return s;
  }, []);

  if (hidden) return null;

  return (
    <article
      ref={containerRef}
      className={`relative max-w-[80%] select-text overflow-visible whitespace-pre-wrap break-words rounded-[8px] px-[1.4rem] py-[1rem] bd3 ${
        isFromUser
          ? 'self-end bg-brand-blue text-gray-0'
          : 'bg-gray-0 text-gray-90'
      }`}
    >
      {menu && (
        <SelectionActionMenu
          top={menu.top}
          left={menu.left}
          menuRef={menuRef}
          onExtract={() => {
            onExtract?.(menu.quote);
            setMenu(null);
            window.getSelection()?.removeAllRanges();
          }}
          onCancel={() => {
            setMenu(null);
            window.getSelection()?.removeAllRanges();
          }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: toRichHTML(text) }} />
    </article>
  );
}
