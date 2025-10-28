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
  const selectionRangeRef = useRef<Range | null>(null);
  const rafLockRef = useRef<number | null>(null);

  const hidden = !isFromUser && text.trim().length === 0;

  /** 스크롤 가능한 부모들을 배열로 반환 (Array iteration 사용) */
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
      if (document.scrollingElement) {
        res.push(document.scrollingElement as HTMLElement);
      }
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

  /** Range 기준으로 메뉴 위치 계산 + state 반영 */
  const computeAndPlaceMenu = useCallback((range: Range) => {
    const rect = range.getBoundingClientRect();
    const base = rect.width || rect.height ? rect : range.getClientRects()[0];
    if (!base) return;

    const MENU_W = 180;
    const MENU_H = 40;
    const GAP = 6;
    const MARGIN = 8;

    const cx = base.left + base.width / 2;
    const spaceBelow = window.innerHeight - base.bottom;
    const placeAbove = spaceBelow < MENU_H + GAP + 6;

    const top = placeAbove
      ? Math.max(MARGIN, base.top - MENU_H - GAP)
      : Math.min(base.bottom + GAP, window.innerHeight - MENU_H - MARGIN);

    const left = Math.max(
      MARGIN,
      Math.min(cx - MENU_W / 2, window.innerWidth - MENU_W - MARGIN),
    );

    setMenu(prev => (prev ? { ...prev, top, left } : { top, left, quote: '' }));
  }, []);

  /** 현재 selection을 읽어 메뉴 quote/좌표 갱신 */
  const updateMenuFromSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!isSelectionInside(sel)) {
      setMenu(null);
      selectionRangeRef.current = null;
      return;
    }
    const range = sel.getRangeAt(0).cloneRange();
    selectionRangeRef.current = range;

    const selText = sel.toString().trim();
    if (!selText) {
      setMenu(null);
      return;
    }

    setMenu(prev =>
      prev ? { ...prev, quote: selText } : { top: 0, left: 0, quote: selText },
    );
    computeAndPlaceMenu(range);
  }, [isSelectionInside, computeAndPlaceMenu]);

  /** selection 변화 반영을 rAF로 디바운스 */
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

  /** 스크롤/리사이즈/포인터 이동 중 과도 호출 방지용 rAF 락 */
  const rafUpdate = useCallback(() => {
    if (rafLockRef.current != null) return;
    rafLockRef.current = requestAnimationFrame(() => {
      rafLockRef.current = null;
      if (menu && selectionRangeRef.current) {
        computeAndPlaceMenu(selectionRangeRef.current);
      }
    });
  }, [menu, computeAndPlaceMenu]);

  /** 문서 전역 selection/포인터 이벤트 관리 */
  useEffect(() => {
    if (hidden) {
      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        if (timerRef.current !== null) clearTimeout(timerRef.current);
      };
    }

    function onSelectionChange(): void {
      if (!selectingRef.current) return;
      scheduleUpdate(0);
    }

    function onPointerDown(e: Event): void {
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
    }

    function finishSelection(): void {
      selectingRef.current = false;
      const sel = window.getSelection();
      const selText = sel ? sel.toString().trim() : '';
      if (!selText) {
        setMenu(null);
        selectionRangeRef.current = null;
        return;
      }
      if (sel && isSelectionInside(sel)) {
        selectionRangeRef.current = sel.getRangeAt(0).cloneRange();
        setMenu(prev =>
          prev
            ? { ...prev, quote: selText }
            : { top: 0, left: 0, quote: selText },
        );
        computeAndPlaceMenu(selectionRangeRef.current);
      }
    }

    function onKeyUp(e: KeyboardEvent): void {
      if (e.key === 'Shift' || e.key.startsWith('Arrow')) scheduleUpdate(0);
    }

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('pointerdown', onPointerDown as EventListener, {
      passive: true,
    });
    document.addEventListener('pointerup', finishSelection as EventListener);
    document.addEventListener('mouseup', finishSelection as EventListener);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener(
        'pointerdown',
        onPointerDown as EventListener,
      );
      document.removeEventListener(
        'pointerup',
        finishSelection as EventListener,
      );
      document.removeEventListener('mouseup', finishSelection as EventListener);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [hidden, scheduleUpdate, computeAndPlaceMenu, isSelectionInside]);

  /** 스크롤/리사이즈/포인터 이동 시 위치 유지 (Array iteration로만) */
  useEffect(() => {
    if (!menu) {
      return undefined;
    }

    const parents = findScrollParents(containerRef.current);

    function onScroll(): void {
      rafUpdate();
    }
    function onResize(): void {
      rafUpdate();
    }
    function onPointerMove(): void {
      rafUpdate();
    }

    window.addEventListener('resize', onResize);
    parents.forEach(p =>
      p.addEventListener('scroll', onScroll, { passive: true }),
    );
    document.addEventListener('pointermove', onPointerMove, { passive: true });

    return function cleanup(): void {
      window.removeEventListener('resize', onResize);
      parents.forEach(p => p.removeEventListener('scroll', onScroll));
      document.removeEventListener('pointermove', onPointerMove);
      if (rafLockRef.current != null) {
        cancelAnimationFrame(rafLockRef.current);
        rafLockRef.current = null;
      }
    };
  }, [menu, findScrollParents, rafUpdate]);

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
          portal
          onExtract={() => {
            onExtract?.(menu.quote);
            setMenu(null);
            window.getSelection()?.removeAllRanges();
            selectionRangeRef.current = null;
          }}
          onCancel={() => {
            setMenu(null);
            window.getSelection()?.removeAllRanges();
            selectionRangeRef.current = null;
          }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: toRichHTML(text) }} />
    </article>
  );
}
