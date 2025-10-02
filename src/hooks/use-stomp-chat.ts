import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IMessage, StompSubscription, IFrame } from '@stomp/stompjs';

import makeStompClient from '@/services/ws/makeStompClient';
import type { IncomingChat, OutgoingChat } from '@/types/chat';

type UseStompChatArgs = {
  paintingId: number;
  token?: string;
  onConnected?: (headers: IFrame['headers']) => void;
  topic?: string;
  onRoomMessage?: (msg: IMessage) => void;
};

type UseStompChat = {
  connected: boolean;
  messages: IncomingChat[];
  send: (content: string) => void;
  disconnect: () => void;
};

export default function useStompChat({
  paintingId,
  token,
  onConnected,
  topic: topicOverride,
  onRoomMessage,
}: UseStompChatArgs): UseStompChat {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<IncomingChat[]>([]);
  const clientRef = useRef<ReturnType<typeof makeStompClient> | null>(null);
  const chatSubRef = useRef<StompSubscription | null>(null);
  const roomSubRef = useRef<StompSubscription | null>(null);
  const onConnectedRef = useRef<typeof onConnected>();
  const onRoomMessageRef = useRef<typeof onRoomMessage>();

  useEffect(() => {
    onConnectedRef.current = onConnected;
  }, [onConnected]);

  useEffect(() => {
    onRoomMessageRef.current = onRoomMessage;
  }, [onRoomMessage]);

  const chatTopic = useMemo(
    () => topicOverride ?? `/topic/chat/art/${paintingId}`,
    [topicOverride, paintingId],
  );
  const roomTopic = useMemo(() => `/room/${paintingId}`, [paintingId]);

  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL as string;
    const client = makeStompClient({ url, token });
    clientRef.current = client;

    client.onConnect = (frame: IFrame) => {
      setConnected(true);
      onConnectedRef.current?.(frame.headers);

      chatSubRef.current = client.subscribe(chatTopic, (f: IMessage) => {
        try {
          const data = JSON.parse(f.body) as IncomingChat;
          setMessages(prev => [...prev, data]);
        } catch {
          /* */
        }
      });

      roomSubRef.current = client.subscribe(roomTopic, (f: IMessage) => {
        onRoomMessageRef.current?.(f);
      });
    };

    client.onStompError = () => {};
    client.onWebSocketClose = () => setConnected(false);
    client.activate();

    return () => {
      try {
        chatSubRef.current?.unsubscribe();
      } catch {
        /* */
      }
      try {
        roomSubRef.current?.unsubscribe();
      } catch {
        /* */
      }
      try {
        client.deactivate();
      } catch {
        /* */
      }
      clientRef.current = null;
      chatSubRef.current = null;
      roomSubRef.current = null;
    };
  }, [token, chatTopic, roomTopic]);

  const send = useCallback(
    (content: string) => {
      const text = content.trim();
      if (!text) return;
      clientRef.current?.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({ paintingId, content: text } as OutgoingChat),
      });
    },
    [paintingId],
  );

  const disconnect = useCallback(() => {
    try {
      chatSubRef.current?.unsubscribe();
    } catch {
      /* */
    }
    try {
      roomSubRef.current?.unsubscribe();
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
