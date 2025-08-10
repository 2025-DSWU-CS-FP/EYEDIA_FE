import { useCallback, useEffect, useRef, useState } from 'react';

export default function useTTS(lang = 'ko-KR') {
  const [ready, setReady] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setReady(false);
      return () => {};
    }

    const synth = window.speechSynthesis;

    const load = () => {
      voicesRef.current = synth
        .getVoices()
        .filter(v => v.lang.startsWith(lang));
      setReady(true);
    };

    load();
    synth.onvoiceschanged = load;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, [lang]);

  const speak = useCallback(
    (
      text: string,
      opts?: {
        rate?: number;
        pitch?: number;
        volume?: number;
        interrupt?: boolean;
      },
    ): void => {
      if (!('speechSynthesis' in window)) return;
      if (!text?.trim()) return;
      if (opts?.interrupt) window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;

      const v = voicesRef.current[0];
      if (v) u.voice = v;
      if (opts?.rate) u.rate = opts.rate;
      if (opts?.pitch) u.pitch = opts.pitch;
      if (opts?.volume !== undefined) u.volume = opts.volume;

      window.speechSynthesis.speak(u);
    },
    [lang],
  );

  const stop = useCallback((): void => {
    window.speechSynthesis.cancel();
  }, []);

  const pause = useCallback((): void => {
    window.speechSynthesis.pause();
  }, []);

  const resume = useCallback((): void => {
    window.speechSynthesis.resume();
  }, []);

  return { ready, speak, stop, pause, resume };
}
