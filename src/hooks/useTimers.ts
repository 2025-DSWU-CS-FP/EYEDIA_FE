import { useRef, useEffect } from 'react';

export default function useTimers() {
  const timers = useRef<number[]>([]);
  const add = (t: number) => {
    timers.current.push(t);
    return t;
  };
  useEffect(() => {
    return () => {
      timers.current.forEach(t => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
      timers.current = [];
    };
  }, []);
  return { add };
}
