import { useCallback, useEffect, useRef, useState } from 'react';

export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voiceName?: string;
  sentencePauseMs?: number;
  style?: 'narration' | 'chatty' | 'fast';
};

type InternalState = {
  cancelRequested: boolean;
};

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?…]|[.]{2,}|[!?]+)\s+|[\n\r]+/g)
    .map(s => s.trim())
    .filter(Boolean);
}

function preprocessForKo(raw: string): string {
  let t = raw.replace(/(\d)(cm|mm|m|km|g|kg|개|명|점)/gi, '$1 $2');
  t = t.replace(/\((\d{3,4})\)/g, ', $1년,');
  return t;
}

function getStylePreset(style: SpeakOptions['style']) {
  switch (style) {
    case 'chatty':
      return { rateAdj: 1.05, pitchAdj: 1.08 };
    case 'fast':
      return { rateAdj: 1.15, pitchAdj: 1.0 };
    case 'narration':
    default:
      return { rateAdj: 0.95, pitchAdj: 1.02 };
  }
}

export default function useTts(defaults?: SpeakOptions) {
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);

  const voiceNameRef = useRef<string | undefined>(defaults?.voiceName);
  const stateRef = useRef<InternalState>({ cancelRequested: false });

  useEffect(() => {
    const load = () => setVoices(synth.getVoices());
    load();
    synth.onvoiceschanged = load;
    return () => {
      synth.onvoiceschanged = null;
    };
  }, [synth]);

  const pickVoice = useCallback(
    (lang?: string, voiceName?: string) => {
      const name = voiceName ?? voiceNameRef.current;
      if (name) {
        const v = voices.find(x => x.name === name);
        if (v) return v;
      }
      if (lang) {
        const v = voices.find(x =>
          x.lang.toLowerCase().startsWith(lang.toLowerCase()),
        );
        if (v) return v;
      }
      return voices[0] ?? null;
    },
    [voices],
  );

  const speak = useCallback(
    (rawText: string, opts?: SpeakOptions) => {
      const text = rawText.trim();
      if (!text) return;

      const style = opts?.style ?? defaults?.style ?? 'narration';
      const preset = getStylePreset(style);

      const rate = opts?.rate ?? defaults?.rate ?? preset.rateAdj;

      const pitch = opts?.pitch ?? defaults?.pitch ?? preset.pitchAdj;

      const volume = opts?.volume ?? defaults?.volume ?? 1;
      const lang = opts?.lang ?? defaults?.lang ?? 'ko-KR';
      const voiceName =
        opts?.voiceName ?? defaults?.voiceName ?? voiceNameRef.current;
      const pauseMs = opts?.sentencePauseMs ?? defaults?.sentencePauseMs ?? 160;

      voiceNameRef.current = voiceName;

      if (synth.speaking || synth.pending) synth.cancel();
      stateRef.current.cancelRequested = false;

      const v = pickVoice(lang, voiceName);
      const prepared = preprocessForKo(text);
      const sentences = splitSentences(prepared);
      if (sentences.length === 0) return;

      setSpeaking(true);

      const speakOne = (i: number) => {
        if (stateRef.current.cancelRequested) {
          setSpeaking(false);
          return;
        }
        const u = new SpeechSynthesisUtterance(sentences[i]);
        u.rate = rate;
        u.pitch = pitch;
        u.volume = volume;
        u.lang = lang;
        if (v) u.voice = v;

        u.onend = () => {
          if (stateRef.current.cancelRequested) {
            setSpeaking(false);
            return;
          }
          if (i < sentences.length - 1) {
            window.setTimeout(() => speakOne(i + 1), pauseMs);
          } else {
            setSpeaking(false);
          }
        };

        u.onerror = () => {
          if (i < sentences.length - 1) {
            window.setTimeout(() => speakOne(i + 1), pauseMs);
          } else {
            setSpeaking(false);
          }
        };

        synth.speak(u);
      };

      speakOne(0);
    },
    [
      defaults?.lang,
      defaults?.pitch,
      defaults?.rate,
      defaults?.sentencePauseMs,
      defaults?.style,
      defaults?.voiceName,
      defaults?.volume,
      pickVoice,
      synth,
    ],
  );

  const cancel = useCallback(() => {
    stateRef.current.cancelRequested = true;
    if (synth.speaking || synth.pending) synth.cancel();
    setSpeaking(false);
  }, [synth]);

  return { voices, speaking, speak, cancel };
}
