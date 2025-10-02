import { MutableRefObject, useCallback } from 'react';

import type { IMessage } from '@stomp/stompjs';
import { nanoid } from 'nanoid';

import type { LocalMsg } from '@/types/chatLocal';

type ArtworkInfo = {
  imgUrl: string;
};

type RoomPayload = {
  paintingId: number;
  answer?: string | null;
  model?: string | null;
  imgUrl?: string | null;
  audioUrl?: string | null;
};

type UseRoomMessageHandlerArgs = {
  paintingId: number;
  artworkInfo: ArtworkInfo;
  processedIdsRef: MutableRefObject<Set<string>>;
  setLocalMessages: React.Dispatch<React.SetStateAction<LocalMsg[]>>;
  startTypewriter: (
    id: string,
    full: string,
    onTick: (partial: string) => void,
    speed?: number,
  ) => void;
  speak: (text: string) => void;
};

export default function useRoomMessageHandler({
  paintingId,
  artworkInfo,
  processedIdsRef,
  setLocalMessages,
  startTypewriter,
  speak,
}: UseRoomMessageHandlerArgs) {
  const onRoomMessage = useCallback(
    (frame: IMessage) => {
      const mid = frame.headers['message-id'] ?? '';
      if (mid && processedIdsRef.current.has(mid)) return;
      try {
        const payload = JSON.parse(frame.body) as RoomPayload;
        if (payload.paintingId !== paintingId) return;
        if (mid) processedIdsRef.current.add(mid);
        const userImageUrl = payload.imgUrl ?? artworkInfo.imgUrl;
        const botAnswer = payload.answer ?? '';

        const imgId = nanoid();
        setLocalMessages(prev => [
          ...prev,
          { id: imgId, sender: 'USER', type: 'IMAGE', imageUrl: userImageUrl },
        ]);

        const botId = nanoid();
        setLocalMessages(prev => [
          ...prev,
          { id: botId, sender: 'BOT', type: 'TEXT', content: '' },
        ]);

        startTypewriter(
          botId,
          botAnswer,
          partial => {
            setLocalMessages(prev =>
              prev.map(m => (m.id === botId ? { ...m, content: partial } : m)),
            );
            if (partial === botAnswer && botAnswer) speak(botAnswer);
          },
          16,
        );
      } catch {
        /* */
      }
    },
    [
      artworkInfo.imgUrl,
      paintingId,
      processedIdsRef,
      setLocalMessages,
      speak,
      startTypewriter,
    ],
  );

  return onRoomMessage;
}
