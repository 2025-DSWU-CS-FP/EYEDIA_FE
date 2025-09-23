import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type STTOptions = {
  lang?: string;
  interim?: boolean;
  continuous?: boolean;
  onFinal?: (text: string) => void;
  onErrorToast?: (msg: string) => void;
};

interface STTAlt {
  transcript: string;
}
interface STTResultItem {
  isFinal: boolean;
  0: STTAlt;
}
interface STTResultEvent {
  results: ArrayLike<STTResultItem>;
}

type RecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives?: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((e: STTResultEvent) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type RecognitionCtor = new () => RecognitionInstance;

function getCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function useSTT(opts?: STTOptions) {
  const {
    lang = 'ko-KR',
    interim = false,
    continuous = false,
    onFinal,
    onErrorToast,
  } = opts ?? {};

  const Ctor = useMemo(getCtor, []);
  const supported =
    !!Ctor && typeof window !== 'undefined' && window.isSecureContext;

  const recogRef = useRef<RecognitionInstance | null>(null);
  const [listening, setListening] = useState(false);
  const triedRetryRef = useRef(false);
  const startingRef = useRef(false);

  useEffect(() => {
    let r: RecognitionInstance | null = null;

    if (Ctor && supported) {
      r = new Ctor();
      r.lang = lang;
      r.interimResults = interim;
      r.continuous = continuous;
      if ('maxAlternatives' in r) r.maxAlternatives = 1;

      r.onstart = () => {
        startingRef.current = false;
        setListening(true);
      };

      r.onresult = e => {
        let finalText = '';
        for (let i = 0; i < e.results.length; i += 1) {
          const item = e.results[i];
          if (item.isFinal) finalText += item[0].transcript;
        }
        const text = finalText.trim();
        if (text) onFinal?.(text);
      };

      r.onerror = e => {
        const code = e?.error ?? 'unknown';
        if (code === 'no-speech') {
          // 마이크는 켰지만 음성이 감지 안 된 경우: 1회 재시도
          if (!triedRetryRef.current) {
            triedRetryRef.current = true;
            try {
              r?.start();
            } catch {}
            return;
          }
          onErrorToast?.('음성이 감지되지 않았어요. 다시 한 번 말씀해 주세요.');
        } else if (code === 'audio-capture') {
          onErrorToast?.('마이크를 찾을 수 없어요. 연결을 확인해 주세요.');
        } else if (code === 'not-allowed' || code === 'service-not-allowed') {
          onErrorToast?.(
            '마이크 권한이 거부되었어요. 브라우저 설정에서 허용해 주세요.',
          );
        } else {
          onErrorToast?.('음성 인식 중 오류가 발생했어요.');
        }
      };

      r.onend = () => {
        setListening(false);
        startingRef.current = false;
        triedRetryRef.current = false;
      };

      recogRef.current = r;
    }

    return () => {
      if (!r) return;
      try {
        r.onstart = null;
        r.onresult = null;
        r.onerror = null;
        r.onend = null;
        r.abort();
      } catch {}
      if (recogRef.current === r) recogRef.current = null;
      setListening(false);
      startingRef.current = false;
      triedRetryRef.current = false;
    };
  }, [Ctor, supported, lang, interim, continuous, onFinal, onErrorToast]);

  const start = useCallback(() => {
    if (!supported) {
      onErrorToast?.(
        'HTTPS 환경에서만 동작해요(또는 브라우저가 지원하지 않음).',
      );
      return;
    }
    if (!recogRef.current || listening || startingRef.current) return;
    startingRef.current = true;
    triedRetryRef.current = false;
    try {
      recogRef.current.start();
    } catch {
      startingRef.current = false;
    }
  }, [supported, listening, onErrorToast]);

  const stop = useCallback(() => {
    if (!recogRef.current) return;
    try {
      recogRef.current.stop();
    } catch {}
  }, []);

  const abort = useCallback(() => {
    if (!recogRef.current) return;
    try {
      recogRef.current.abort();
    } catch {}
    setListening(false);
    startingRef.current = false;
    triedRetryRef.current = false;
  }, []);

  return { supported, listening, start, stop, abort };
}
