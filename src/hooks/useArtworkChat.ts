import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { nanoid } from 'nanoid';

import { PROMPT_MESSAGES } from '@/constants/promptMessages';
import useStt from '@/hooks/useSTT';
import useTimers from '@/hooks/useTimers';
import useTts from '@/hooks/useTTS';
import useTypewriter from '@/hooks/useTypewriter';
import type { LocalMsg } from '@/types/chatLocal';

/* const TYPEWRITER_LAG_MS = 300; */
const CLOUD_TIMEOUT_MS = 1200;
export const TTS_MAX_CHARS = 10;

function cap(text: string): string {
  return text.length > TTS_MAX_CHARS ? text.slice(0, TTS_MAX_CHARS) : text;
}

const IS_IOS =
  typeof navigator !== 'undefined' &&
  /iP(hone|ad|od)/i.test(navigator.userAgent);

type AudioContextCtor = new (
  contextOptions?: AudioContextOptions,
) => AudioContext;

const getAudioContextCtor = (): AudioContextCtor | null => {
  const w = window as unknown as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
};

type DecodeAudioDataCb = (
  audioData: ArrayBuffer,
  success: (buf: AudioBuffer) => void,
  failure?: (err: DOMException) => void,
) => void;

function isPromiseLike<T>(x: unknown): x is PromiseLike<T> {
  return !!x && typeof (x as { then?: unknown }).then === 'function';
}

function decodeAudio(ctx: AudioContext, ab: ArrayBuffer): Promise<AudioBuffer> {
  try {
    const maybe = (
      ctx.decodeAudioData as unknown as (d: ArrayBuffer) => unknown
    )(ab);
    if (isPromiseLike<AudioBuffer>(maybe)) {
      return Promise.resolve(maybe as PromiseLike<AudioBuffer>);
    }
  } catch {
    /* */
  }
  return new Promise<AudioBuffer>((resolve, reject) => {
    (ctx.decodeAudioData as unknown as DecodeAudioDataCb)(
      ab,
      resolve,
      (err?: DOMException) =>
        reject(err ?? new DOMException('decodeAudioData failed')),
    );
  });
}

const GOOGLE_TTS_ENDPOINT =
  'https://texttospeech.googleapis.com/v1/text:synthesize';

type AudioEncoding = 'MP3' | 'OGG_OPUS' | 'LINEAR16';

function b64ToBlob(base64: string, mime: string): Blob {
  const bin = atob(base64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

type UseArtworkChatArgs = {
  paintingId: number;
  onError: (msg: string) => void;
  send: (content: string) => void;
};

export default function useArtworkChat({ onError, send }: UseArtworkChatArgs) {
  const [localMessages, setLocalMessages] = useState<LocalMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const didAutoAskRef = useRef(false);

  const { add } = useTimers();
  const { start: startTypewriter } = useTypewriter(add);

  const stt = useStt({
    lang: 'ko-KR',
    continuous: false,
    interimResults: true,
  });

  const webTts = useTts({
    lang: 'ko-KR',
    rate: 1,
    voiceName: 'Google 한국의 여성',
  });

  const apiKey = import.meta.env.VITE_TTS_API_KEY as string | undefined;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsCacheRef = useRef<Map<string, string>>(new Map());

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioUnlockedRef = useRef(false);

  const ensureAudioUnlocked = useCallback(async () => {
    if (audioUnlockedRef.current) return;
    const Ctx = getAudioContextCtor();
    if (!Ctx) {
      audioUnlockedRef.current = true;
      return;
    }
    let ctx = audioCtxRef.current;
    if (!ctx) {
      ctx = new Ctx();
      audioCtxRef.current = ctx;
    }
    try {
      if (ctx.state === 'suspended') await ctx.resume();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.start(0);
    } catch {
      /* */
    }
    audioUnlockedRef.current = true;
  }, []);

  const cacheKeyOf = (
    text: string,
    languageCode: string,
    voiceName: string,
    encoding: AudioEncoding,
  ) => `${languageCode}::${voiceName}::${encoding}::${text}`;

  const cloudSynthesize = useCallback(
    async (text: string): Promise<string> => {
      if (!apiKey) throw new Error('NO_KEY');
      const languageCode = 'ko-KR';
      const voiceName = 'ko-KR-Chirp3-HD-Alnilam';
      const audioEncoding: AudioEncoding = IS_IOS ? 'MP3' : 'LINEAR16';

      const key = cacheKeyOf(text, languageCode, voiceName, audioEncoding);
      const cached = ttsCacheRef.current.get(key);
      if (cached) return cached;

      const resp = await fetch(
        `${GOOGLE_TTS_ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text },
            voice: { languageCode, name: voiceName },
            audioConfig: {
              audioEncoding,
              speakingRate: 1,
              pitch: 0,
            },
          }),
        },
      );

      if (!resp.ok) {
        const detail = (await resp.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        const message = detail?.error?.message ?? `HTTP ${resp.status}`;
        throw new Error(message);
      }

      const json = (await resp.json()) as { audioContent: string };

      const MIME_BY_ENCODING: Record<AudioEncoding, string> = {
        LINEAR16: 'audio/wav',
        OGG_OPUS: 'audio/ogg',
        MP3: 'audio/mpeg',
      };
      const mime = MIME_BY_ENCODING[audioEncoding];

      const blob = b64ToBlob(json.audioContent, mime);
      const url = URL.createObjectURL(blob);
      ttsCacheRef.current.set(key, url);
      return url;
    },
    [apiKey],
  );

  const playCloudFirstWithFallback = useCallback(
    async (preview: string): Promise<void> => {
      await ensureAudioUnlocked();

      let cloudStarted = false;
      let fallbackStarted = false;

      const startCloud = (async () => {
        const url = await cloudSynthesize(preview);

        if (IS_IOS && audioCtxRef.current) {
          const res = await fetch(url);
          const ab = await res.arrayBuffer();
          const buf = await decodeAudio(audioCtxRef.current, ab);
          const src = audioCtxRef.current.createBufferSource();
          src.buffer = buf;
          src.connect(audioCtxRef.current.destination);
          src.start(0);
        } else {
          if (!audioRef.current) audioRef.current = new Audio();
          audioRef.current.setAttribute('playsinline', 'true');
          audioRef.current.setAttribute('preload', 'auto');
          audioRef.current.src = url;
          await audioRef.current.play();
        }

        cloudStarted = true;
        if (fallbackStarted) {
          try {
            webTts.cancel();
          } catch {
            /* */
          }
        }
      })();

      const timeoutGate = new Promise<void>(resolve => {
        window.setTimeout(() => {
          if (!cloudStarted) {
            fallbackStarted = true;
            webTts.speak(preview);
          }
          resolve();
        }, CLOUD_TIMEOUT_MS);
      });

      await Promise.race([startCloud, timeoutGate]);
    },
    [cloudSynthesize, ensureAudioUnlocked, webTts],
  );

  const speak = useCallback(
    (text: string): void => {
      const raw = text.trim();
      if (!raw) return;
      const preview = cap(raw);
      playCloudFirstWithFallback(preview).catch(() => {});
    },
    [playCloudFirstWithFallback],
  );

  const { listening, finalText, resetFinal, status, start } = stt;

  const submitAsk = useCallback(
    async (raw: string, opts?: { showUserBubble?: boolean }) => {
      const text = raw.trim();
      if (!text) return;

      await ensureAudioUnlocked();

      const showUserBubble = opts?.showUserBubble ?? true;
      if (showUserBubble) {
        setLocalMessages(prev => [
          ...prev,
          { id: nanoid(), sender: 'USER', type: 'TEXT', content: text },
        ]);
      }

      setTyping(true);

      try {
        send(text);
      } catch {
        setTyping(false);
        onError('질문 전송에 실패했어요. 다시 시도해 주세요.');
      }
    },
    [ensureAudioUnlocked, onError, send],
  );

  useEffect(() => {
    if (!listening && finalText.trim()) {
      const t = finalText.trim();
      resetFinal();
      submitAsk(t, { showUserBubble: true }).catch(() => {});
    }
  }, [listening, finalText, resetFinal, submitAsk]);

  const startVoice = async () => {
    if (listening || typing) return;
    await ensureAudioUnlocked();
    resetFinal();
    start();
  };

  const promptText = useMemo(() => {
    if (listening) return PROMPT_MESSAGES.speaking;
    if (typing) return PROMPT_MESSAGES.generating;
    return PROMPT_MESSAGES.ask;
  }, [listening, typing]);

  const voiceDisabled =
    listening || typing || status === 'denied' || status === 'unavailable';

  // 외부에서 타자 시작 직전에 typing 끄기 위한 헬퍼
  const stopTyping = useCallback(() => setTyping(false), []);

  return {
    localMessages,
    setLocalMessages,
    typing,
    stopTyping, // ✅ 추가
    submitAsk,
    startVoice,
    promptText,
    voiceDisabled,
    didAutoAskRef,
    startTypewriter,
    speak,
  };
}
