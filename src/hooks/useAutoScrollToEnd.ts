import { useEffect } from 'react';

export default function useAutoScrollToEnd(
  deps: unknown[],
  scrollerRef: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const run = () => {
      el.scrollTop = el.scrollHeight;
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
