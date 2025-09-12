import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IMessage, StompSubscription } from '@stomp/stompjs';
import makeStompClient from '@/services/ws/makeStompClient';
import type { IncomingChat, OutgoingChat } from '@/types/chat';

type UseStompChatArgs = { paintingId: number; token?: string };

type UseStompChat = {
  connected: boolean;
  messages: IncomingChat[];
  send: (content: string) => void;
  disconnect: () => void;
};

export default function useStompChat({
  paintingId,
  token,
}: UseStompChatArgs): UseStompChat {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<IncomingChat[]>([]);
  const clientRef = useRef<ReturnType<typeof makeStompClient> | null>(null);
  const subRef = useRef<StompSubscription | null>(null);

  const topic = useMemo(
    () => `/topic/chat/art/${paintingId}` as const,
    [paintingId],
  );

  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL as string;
    const client = makeStompClient({ url, token });
    clientRef.current = client;

    client.onConnect = () => {
      setConnected(true);
      subRef.current = client.subscribe(topic, (frame: IMessage) => {
        try {
          const data = JSON.parse(frame.body) as IncomingChat;
          if (data.paintingId === paintingId && data.content) {
            setMessages(prev => [...prev, data]);
          }
        } catch {
          /* */
        }
      });
    };

    client.onStompError = () => {};
    client.onWebSocketClose = () => setConnected(false);
    client.activate();

    return () => {
      try {
        subRef.current?.unsubscribe();
      } catch {
        /* */
      }
      try {
        client.deactivate();
      } catch {
        /* */
      }
      clientRef.current = null;
      subRef.current = null;
    };
  }, [paintingId, token, topic]);

  const send = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      const payload: OutgoingChat = { paintingId, content: content.trim() };
      clientRef.current?.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(payload),
      });
    },
    [paintingId],
  );

  const disconnect = useCallback(() => {
    try {
      subRef.current?.unsubscribe();
    } catch {
      /* */
    }
    try {
      clientRef.current?.deactivate();
    } catch {
      /* */
    }
  }, []);

  return { connected, messages, send, disconnect };
}
