import { useCallback, useEffect, useRef, useState } from 'react';

type SpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voiceName?: string;
};

export default function useTts(defaults?: SpeakOptions) {
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

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
      if (voiceName) {
        const v = voices.find(x => x.name === voiceName);
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
    (text: string, opts?: SpeakOptions) => {
      if (!text.trim()) return;
      if (synth.speaking) synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const rate = opts?.rate ?? defaults?.rate ?? 1;
      const pitch = opts?.pitch ?? defaults?.pitch ?? 1;
      const volume = opts?.volume ?? defaults?.volume ?? 1;
      const lang = opts?.lang ?? defaults?.lang ?? 'ko-KR';
      const voiceName = opts?.voiceName ?? defaults?.voiceName;

      u.rate = rate;
      u.pitch = pitch;
      u.volume = volume;
      u.lang = lang;
      const v = pickVoice(lang, voiceName);
      if (v) u.voice = v;

      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);

      utterRef.current = u;
      synth.speak(u);
    },
    [
      defaults?.lang,
      defaults?.pitch,
      defaults?.rate,
      defaults?.voiceName,
      defaults?.volume,
      pickVoice,
      synth,
    ],
  );

  const cancel = useCallback(() => {
    if (synth.speaking || synth.pending) synth.cancel();
    setSpeaking(false);
  }, [synth]);

  return { voices, speaking, speak, cancel };
}
