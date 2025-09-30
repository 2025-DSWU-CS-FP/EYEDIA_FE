import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type UseSttOptions = {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
};

type SttStatus = 'idle' | 'listening' | 'denied' | 'unavailable' | 'error';

export default function useStt(options?: UseSttOptions) {
  const {
    lang = 'ko-KR',
    continuous = true,
    interimResults = true,
  } = options ?? {};

  const SpeechRecognitionImpl = useMemo<
    SpeechRecognitionConstructor | undefined
  >(() => {
    const w = window as unknown as SpeechWindow;
    return w.SpeechRecognition || w.webkitSpeechRecognition;
  }, []);

  const [status, setStatus] = useState<SttStatus>('idle');
  const [interim, setInterim] = useState('');
  const [finalText, setFinalText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognition | null>(null);
  const endOnceRef = useRef(false);

  useEffect(() => {
    if (!SpeechRecognitionImpl) {
      setStatus('unavailable');
      return () => {};
    }

    const rec = new SpeechRecognitionImpl();
    rec.lang = lang;
    rec.continuous = continuous;
    rec.interimResults = interimResults;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setStatus('listening');
      setInterim('');
      setError(null);
      endOnceRef.current = false;
    };

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interimBuf = '';
      let finalBuf = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const r = e.results[i];
        if (r.isFinal) finalBuf += r[0].transcript;
        else interimBuf += r[0].transcript;
      }
      setInterim(interimBuf);
      if (finalBuf)
        setFinalText(prev => (prev ? `${prev} ${finalBuf}` : finalBuf));
    };

    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === 'not-allowed') setStatus('denied');
      else setStatus('error');
      setError(e.message ?? e.error ?? 'STT error');
    };

    rec.onend = () => {
      if (endOnceRef.current) return;
      setStatus(prev => (prev === 'listening' ? 'idle' : prev));
    };

    recRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch {
        /* */
      }
      recRef.current = null;
    };
  }, [SpeechRecognitionImpl, lang, continuous, interimResults]);

  const start = useCallback(() => {
    if (!recRef.current || status === 'listening') return;
    setFinalText('');
    setInterim('');
    setError(null);
    try {
      recRef.current.start();
    } catch {
      /* */
    }
  }, [status]);

  const stop = useCallback(() => {
    if (!recRef.current) return;
    endOnceRef.current = true;
    try {
      recRef.current.stop();
    } catch {
      /* */
    }
  }, []);

  return {
    available: !!SpeechRecognitionImpl,
    status,
    listening: status === 'listening',
    interim,
    finalText,
    error,
    start,
    stop,
    resetFinal: () => setFinalText(''),
  };
}
