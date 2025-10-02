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

type UseArtworkChatArgs = {
  paintingId: number;
  onError: (msg: string) => void;
};

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
  const { speak } = useTts({
    lang: 'ko-KR',
    rate: 1,
    voiceName: 'Google 한국의 여성',
  });

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
        setTyping(false);
        const botId = nanoid();
        setLocalMessages(prev => [
          ...prev,
          { id: botId, sender: 'BOT', type: 'TEXT', content: '' },
        ]);
        startTypewriter(
          botId,
          res.answer,
          partial => {
            setLocalMessages(prev =>
              prev.map(m => (m.id === botId ? { ...m, content: partial } : m)),
            );
            if (partial === res.answer) speak(res.answer);
          },
          16,
        );
      } catch {
        setTyping(false);
        onError('질문 전송에 실패했어요. 다시 시도해 주세요.');
      }
    },
    [ac, onError, paintingId, speak, startTypewriter],
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
