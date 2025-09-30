import { useRef, useEffect } from 'react';

export default function useAbortControllerRef() {
  const ref = useRef<AbortController | null>(null);
  const renew = () => {
    ref.current?.abort('renew');
    ref.current = new AbortController();
    return ref.current;
  };
  useEffect(() => () => ref.current?.abort('unmount'), []);
  return { ref, renew, signal: () => ref.current?.signal };
}
