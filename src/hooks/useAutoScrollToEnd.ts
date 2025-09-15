import { useEffect } from 'react';

export default function useAutoScrollToEnd(
  deps: unknown[],
  endRef: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    const f = () =>
      endRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    requestAnimationFrame(f);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
