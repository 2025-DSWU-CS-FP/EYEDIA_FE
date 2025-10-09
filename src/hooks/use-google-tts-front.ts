import { useCallback, useRef, useState } from 'react';

type AudioEncoding = 'MP3' | 'OGG_OPUS' | 'LINEAR16';

export type CloudTtsOptions = {
  languageCode?: string;
  voiceName?: string;
  speakingRate?: number;
  pitch?: number;
  audioEncoding?: AudioEncoding;
};

type State = 'idle' | 'loading' | 'playing' | 'error';

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const TTS_MAX_CHARS = 650;
function cap(text: string): string {
  return text.length > TTS_MAX_CHARS ? text.slice(0, TTS_MAX_CHARS) : text;
}

export default function useGoogleTtsFront(defaults?: CloudTtsOptions) {
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cache = useRef<Map<string, string>>(new Map());
  const apiKey = import.meta.env.VITE_TTS_API_KEY as string | undefined;

  const speak = useCallback(
    async (text: string, opts?: CloudTtsOptions) => {
      const raw = text.trim();
      if (!raw) return;
      if (!apiKey) {
        setError('Missing VITE_TTS_API_KEY');
        setState('error');
        return;
      }

      const capped = cap(raw);

      const languageCode =
        opts?.languageCode ?? defaults?.languageCode ?? 'ko-KR';
      const voiceName =
        opts?.voiceName ?? defaults?.voiceName ?? 'ko-KR-Wavenet-A';
      const audioEncoding: AudioEncoding =
        opts?.audioEncoding ?? defaults?.audioEncoding ?? 'MP3';
      const speakingRate = opts?.speakingRate ?? defaults?.speakingRate ?? 1.05;
      const pitch = opts?.pitch ?? defaults?.pitch ?? 0;

      const payload = {
        input: { text: capped },
        voice: { languageCode, name: voiceName },
        audioConfig: { audioEncoding, speakingRate, pitch },
      };

      const key = await sha256(JSON.stringify({ ...payload, v: 1 }));
      const cached = cache.current.get(key);

      try {
        setError(null);
        setState('loading');

        let url = cached;
        if (!url) {
          const resp = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            },
          );

          if (!resp.ok) {
            const detail = await resp.json().catch(() => null);
            throw new Error(detail?.error?.message ?? `HTTP ${resp.status}`);
          }

          const json = (await resp.json()) as { audioContent: string };
          const bytes = Uint8Array.from(atob(json.audioContent), c =>
            c.charCodeAt(0),
          );

          const MIME_BY_ENCODING: Record<AudioEncoding, string> = {
            LINEAR16: 'audio/wav',
            OGG_OPUS: 'audio/ogg',
            MP3: 'audio/mpeg',
          };
          const mime = MIME_BY_ENCODING[audioEncoding];

          const blob = new Blob([bytes], { type: mime });
          url = URL.createObjectURL(blob);
          cache.current.set(key, url);
        }

        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = url;
        setState('playing');
        await audioRef.current.play();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'tts_failed');
        setState('error');
        throw e;
      }
    },
    [apiKey, defaults],
  );

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setState('idle');
  }, []);

  return { state, error, speak, stop };
}
