import { useRef } from 'react';

export default function useTypewriter(registerTimer: (t: number) => void) {
  const runningRef = useRef<Record<string, boolean>>({});

  const start = (
    id: string,
    fullText: string,
    setText: (partial: string) => void,
    speed = 16,
  ) => {
    runningRef.current[id] = true;
    let i = 0;
    const tick = () => {
      if (!runningRef.current[id]) return;
      i += 1;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) return;
      const t = window.setTimeout(tick, speed);
      registerTimer(t);
    };
    tick();
  };

  const stop = (id: string) => {
    runningRef.current[id] = false;
  };

  return { start, stop };
}
