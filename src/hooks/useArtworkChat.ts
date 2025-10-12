import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { nanoid } from 'nanoid';

import { PROMPT_MESSAGES } from '@/constants/promptMessages';
import useAbortControllerRef from '@/hooks/useAbortControllerRef';
import useStt from '@/hooks/useSTT';
import useTimers from '@/hooks/useTimers';
import useTts from '@/hooks/useTTS';
import useTypewriter from '@/hooks/useTypewriter';
import { askArtworkLLM } from '@/services/ws/chat';
import type { LocalMsg } from '@/types/chatLocal';

const TYPEWRITER_LAG_MS = 300;
export const TTS_MAX_CHARS = 10;
function cap(text: string): string {
  return text.length > TTS_MAX_CHARS ? text.slice(0, TTS_MAX_CHARS) : text;
}

type UseArtworkChatArgs = {
  paintingId: number;
  onError: (msg: string) => void;
};

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

export default function useArtworkChat({
  paintingId,
  onError,
}: UseArtworkChatArgs) {
  const [localMessages, setLocalMessages] = useState<LocalMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const didAutoAskRef = useRef(false);

  const { add } = useTimers();
  const ac = useAbortControllerRef();
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
      const audioEncoding: AudioEncoding = 'LINEAR16';

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
            audioConfig: { audioEncoding, speakingRate: 1, pitch: 0 },
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
      const mime = MIME_BY_ENCODING.LINEAR16;

      const blob = b64ToBlob(json.audioContent, mime);
      const url = URL.createObjectURL(blob);
      ttsCacheRef.current.set(key, url);
      return url;
    },
    [apiKey],
  );

  const speak = useCallback(
    (text: string): void => {
      const t = text.trim();
      if (!t) return;
      const capped = cap(t);
      cloudSynthesize(capped)
        .then(url => {
          if (!audioRef.current) audioRef.current = new Audio();
          audioRef.current.src = url;
          audioRef.current.play().catch(() => {
            webTts.speak(capped);
          });
        })
        .catch(() => {
          webTts.speak(capped);
        });
    },
    [cloudSynthesize, webTts],
  );

  const { listening, finalText, resetFinal, status, start } = stt;

  const submitAsk = useCallback(
    async (raw: string, opts?: { showUserBubble?: boolean }) => {
      const text = raw.trim();
      if (!text) return;
      const showUserBubble = opts?.showUserBubble ?? true;

      if (showUserBubble) {
        setLocalMessages(prev => [
          ...prev,
          { id: nanoid(), sender: 'USER', type: 'TEXT', content: text },
        ]);
      }

      setTyping(true);

      try {
        const { signal } = ac.renew();
        const res = await askArtworkLLM({ paintingId, text }, signal);

        const full = res.answer.trim();
        const preview = cap(full);

        const webPreviewCancel = () => {
          try {
            webTts.cancel();
          } catch {
            /** */
          }
        };
        webTts.speak(preview);

        let url: string | null = null;
        try {
          url = await cloudSynthesize(preview);
        } catch {
          url = null;
        }

        const botId = nanoid();
        setLocalMessages(prev => [
          ...prev,
          { id: botId, sender: 'BOT', type: 'TEXT', content: '' },
        ]);

        let started = false;
        const startTypingNow = () => {
          if (started) return;
          started = true;
          setTyping(false);
          startTypewriter(
            botId,
            full,
            partial => {
              setLocalMessages(prev =>
                prev.map(m =>
                  m.id === botId ? { ...m, content: partial } : m,
                ),
              );
            },
            16,
          );
        };

        if (url) {
          if (!audioRef.current) audioRef.current = new Audio();
          const a = audioRef.current;
          a.src = url;

          try {
            await a.play();
            webPreviewCancel();
            window.setTimeout(startTypingNow, TYPEWRITER_LAG_MS);
          } catch {
            window.setTimeout(startTypingNow, 120);
          }
        } else {
          window.setTimeout(startTypingNow, 120);
        }
      } catch {
        setTyping(false);
        onError('질문 전송에 실패했어요. 다시 시도해 주세요.');
      }
    },
    [
      ac,
      onError,
      paintingId,
      cloudSynthesize,
      webTts,
      startTypewriter,
      setLocalMessages,
    ],
  );

  const startVoice = () => {
    if (listening || typing) return;
    resetFinal();
    start();
  };

  useEffect(() => {
    if (!listening && finalText.trim()) {
      const text = finalText.trim();
      resetFinal();
      submitAsk(text, { showUserBubble: true });
    }
  }, [listening, finalText, resetFinal, submitAsk]);

  const promptText = useMemo(() => {
    if (listening) return PROMPT_MESSAGES.speaking;
    if (typing) return PROMPT_MESSAGES.generating;
    return PROMPT_MESSAGES.ask;
  }, [listening, typing]);

  const voiceDisabled =
    listening || typing || status === 'denied' || status === 'unavailable';

  return {
    localMessages,
    setLocalMessages,
    typing,
    submitAsk,
    startVoice,
    promptText,
    voiceDisabled,
    didAutoAskRef,
    startTypewriter,
    speak,
  };
}
