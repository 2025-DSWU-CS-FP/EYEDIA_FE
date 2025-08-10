import { useCallback, useEffect, useRef, useState } from 'react';

interface ISpeechRecognitionAlternative {
  transcript: string;
  confidence?: number;
}
interface ISpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  0: ISpeechRecognitionAlternative;
  [index: number]: ISpeechRecognitionAlternative;
  item(index: number): ISpeechRecognitionAlternative;
}
interface ISpeechRecognitionResultList {
  length: number;
  [index: number]: ISpeechRecognitionResult;
  item(index: number): ISpeechRecognitionResult;
}
interface ISpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: ISpeechRecognitionResultList;
}
interface ISpeechRecognitionErrorEvent extends Event {
  error: string; // 'not-allowed' | 'no-speech' | 'aborted' | 'audio-capture' ...
  message?: string;
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((this: ISpeechRecognition, ev: ISpeechRecognitionEvent) => void)
    | null;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onerror:
    | ((this: ISpeechRecognition, ev: ISpeechRecognitionErrorEvent) => void)
    | null;
}
type SpeechRecognitionConstructor = new () => ISpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type UseSTTOptions = {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  keepAlive?: boolean;
  restartDelayMs?: number;
};

type STTState = {
  engine: 'standard' | 'webkit' | 'none';
  supported: boolean;
  listening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  abort: () => void;
  reset: () => void;
};

export default function useSTT({
  lang = 'ko-KR',
  continuous = true,
  interimResults = true,
  keepAlive = true,
  restartDelayMs = 150,
}: UseSTTOptions = {}): STTState {
  const [engine, setEngine] = useState<'standard' | 'webkit' | 'none'>('none');
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recRef = useRef<ISpeechRecognition | null>(null);
  const wantListeningRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const SR: SpeechRecognitionConstructor | undefined =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SR) {
      setEngine('none');
      setSupported(false);
      return () => {};
    }
    setEngine(window.SpeechRecognition ? 'standard' : 'webkit');
    setSupported(true);
    return () => {};
  }, []);

  useEffect(() => {
    if (!supported) return () => {};

    const SR: SpeechRecognitionConstructor | undefined =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return () => {};

    const rec = new SR();
    rec.lang = lang;
    rec.continuous = continuous;
    rec.interimResults = interimResults;
    rec.maxAlternatives = 1;

    rec.onresult = (e: ISpeechRecognitionEvent) => {
      let interim = '';
      let finals = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const r = e.results[i];
        const t = r[0]?.transcript ?? '';
        if (r.isFinal) finals += t;
        else interim += t;
      }
      if (interim) setInterimTranscript(interim);
      if (finals) {
        setTranscript(prev => (prev ? `${prev} ${finals}` : finals));
        setInterimTranscript('');
      }
    };

    rec.onstart = () => {
      setListening(true);
      setError(null);
    };

    rec.onend = () => {
      setListening(false);
      if (keepAlive && wantListeningRef.current) {
        if (restartTimerRef.current !== null)
          window.clearTimeout(restartTimerRef.current);
        restartTimerRef.current = window.setTimeout(() => {
          try {
            rec.start();
          } catch {
            /* 재시작 실패 무시 */
          }
        }, restartDelayMs);
      }
    };

    rec.onerror = (e: ISpeechRecognitionErrorEvent) => {
      setError(e.error || 'recognition_error');
      setListening(false);
    };

    recRef.current = rec;

    return () => {
      if (restartTimerRef.current !== null) {
        window.clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      try {
        rec.onresult = null;
        rec.onstart = null;
        rec.onend = null;
        rec.onerror = null;
        rec.stop();
      } catch {
        /* no-op */
      }
      recRef.current = null;
    };
  }, [supported, lang, continuous, interimResults, keepAlive, restartDelayMs]);

  /** 제어 함수 */
  const start = useCallback(async (): Promise<void> => {
    const rec = recRef.current;
    if (!rec || listening) return;
    setError(null);
    setInterimTranscript('');
    wantListeningRef.current = true;
    try {
      rec.start(); // HTTPS + 사용자 제스처 이후 호출 권장
    } catch (e) {
      setError(e instanceof Error ? e.message : 'start_failed');
      wantListeningRef.current = false;
    }
  }, [listening]);

  const stop = useCallback(async (): Promise<void> => {
    const rec = recRef.current;
    if (!rec) return;
    wantListeningRef.current = false;
    try {
      rec.stop();
    } catch {
      /* no-op */
    }
  }, []);

  const abort = useCallback((): void => {
    const rec = recRef.current;
    wantListeningRef.current = false;

    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    if (!rec) return;

    try {
      rec.abort();
    } catch {
      /* no-op */
    }
  }, []);

  const reset = useCallback((): void => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    engine,
    supported,
    listening,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
    abort,
    reset,
  };
}
