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

  const findScrollParents = useCallback(
    (el: HTMLElement | null): HTMLElement[] => {
      const res: HTMLElement[] = [];
      let node: HTMLElement | null = el;
      while (node && node !== document.body) {
        const style = window.getComputedStyle(node);
        const oy = style.overflowY;
        if (oy === 'auto' || oy === 'scroll') res.push(node);
        node = node.parentElement;
      }
      if (document.scrollingElement)
        res.push(document.scrollingElement as HTMLElement);
      return res;
    },
    [],
  );

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
    if (!rects.length) return;

    const last = rects[rects.length - 1]; // ✅ viewport 좌표
    const quote = sel.toString().trim();
    if (!quote) {
      setMenu(null);
      return;
    }

    // 화면 밖으로 안 튀게 클램프
    const MENU_W = 180;
    const MENU_H = 40;
    const margin = 8;

    // 아래 공간이 부족하면 위로 띄우기
    const spaceBelow = window.innerHeight - last.bottom;
    const placeAbove = spaceBelow < MENU_H + 12;

    const top = placeAbove
      ? Math.max(margin, last.top - MENU_H - 6)
      : Math.min(last.bottom + 6, window.innerHeight - MENU_H - margin);
    const left = Math.max(
      margin,
      Math.min(last.left, window.innerWidth - MENU_W - margin),
    );

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

  useEffect(() => {
    if (!menu) {
      return undefined;
    }
    const parents = findScrollParents(containerRef.current);
    const handler = (): void => {
      scheduleUpdate(0);
    };
    window.addEventListener('resize', handler);
    parents.forEach(p =>
      p.addEventListener('scroll', handler, { passive: true }),
    );
    return () => {
      window.removeEventListener('resize', handler);
      parents.forEach(p => p.removeEventListener('scroll', handler));
    };
  }, [menu, findScrollParents, scheduleUpdate]);

  const toRichHTML = useCallback((value: string) => {
    const escape = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let s = escape(value);
    // **bold**, __bold__, *bold* 지원
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
