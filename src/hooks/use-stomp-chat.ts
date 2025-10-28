import { useCallback, useEffect, useRef, useState } from 'react';

import { IMessage, StompSubscription, IFrame } from '@stomp/stompjs';

import makeStompClient from '@/services/ws/makeStompClient';
import type { IncomingChat } from '@/types/chat';

export type QueueEventPayload = {
  paintingId?: number;
  imgUrl?: string;
  title?: string;
  artist?: string;
  description?: string;
  exhibition?: string;
  artId?: number;
};

type UseStompChatArgs = {
  paintingId?: number;
  token?: string;
  onConnected?: (headers: IFrame['headers']) => void;
  topic?: string;
  onRoomMessage?: (msg: IMessage) => void;
};

type UseStompChat = {
  connected: boolean;
  chatMessages: IncomingChat[];
  events: QueueEventPayload[];
  send: (text: string) => void;
  disconnect: () => void;
  resolvedPaintingId: number | null;
};

export default function useStompChat({
  paintingId: externalPaintingId,
  token,
  onConnected,
  topic: topicOverride,
  onRoomMessage,
}: UseStompChatArgs): UseStompChat {
  const [connected, setConnected] = useState(false);

  const [chatMessages, setChatMessages] = useState<IncomingChat[]>([]);
  const [events, setEvents] = useState<QueueEventPayload[]>([]);
  const [resolvedPaintingId, setResolvedPaintingId] = useState<number | null>(
    externalPaintingId ?? null,
  );

  const clientRef = useRef<ReturnType<typeof makeStompClient> | null>(null);

  const eventsSubRef = useRef<StompSubscription | null>(null);
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

  useEffect(() => {
    if (externalPaintingId && externalPaintingId !== resolvedPaintingId) {
      setResolvedPaintingId(externalPaintingId);
    }
  }, [externalPaintingId, resolvedPaintingId]);

  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL as string;
    const client = makeStompClient({ url, token });
    clientRef.current = client;

    const subscribeChatAndRoom = (pid: number) => {
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

      if (pid > 0) {
        chatSubRef.current = client.subscribe(
          `/topic/chat/art/${pid}`,
          (f: IMessage) => {
            try {
              const data = JSON.parse(f.body) as IncomingChat;
              setChatMessages(prev => [...prev, data]);
            } catch {
              /* */
            }
          },
        );

        roomSubRef.current = client.subscribe(`/room/${pid}`, (f: IMessage) => {
          onRoomMessageRef.current?.(f);
        });
      }
    };

    client.onConnect = (frame: IFrame) => {
      setConnected(true);
      onConnectedRef.current?.(frame.headers);

      if (topicOverride === '/queue/events') {
        eventsSubRef.current = client.subscribe(
          '/queue/events',
          (f: IMessage) => {
            try {
              const ev = JSON.parse(f.body) as QueueEventPayload;
              setEvents(prev => [...prev, ev]);
              if (typeof ev.paintingId === 'number' && ev.paintingId > 0) {
                setResolvedPaintingId(prev => {
                  const next = ev.paintingId!;
                  if (prev !== next) subscribeChatAndRoom(next);
                  return next;
                });
              }
            } catch {
              /* */
            }
          },
        );
      }

      if (externalPaintingId && externalPaintingId > 0) {
        setResolvedPaintingId(externalPaintingId);
        subscribeChatAndRoom(externalPaintingId);
      }

      if (!externalPaintingId && resolvedPaintingId) {
        subscribeChatAndRoom(resolvedPaintingId);
      }
    };

    client.onStompError = () => {};
    client.onWebSocketClose = () => setConnected(false);
    client.activate();

    return () => {
      try {
        eventsSubRef.current?.unsubscribe();
      } catch {
        /* */
      }
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
      eventsSubRef.current = null;
      chatSubRef.current = null;
      roomSubRef.current = null;
    };
  }, [token, topicOverride, externalPaintingId, resolvedPaintingId]);

  const send = useCallback(
    (content: string) => {
      const text = content.trim();
      if (!text) return;
      if (!clientRef.current || !resolvedPaintingId) return;

      clientRef.current.publish({
        destination: '/app/ask',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          paintingId: resolvedPaintingId,
          text,
        }),
      });
    },
    [resolvedPaintingId],
  );

  const disconnect = useCallback(() => {
    try {
      eventsSubRef.current?.unsubscribe();
    } catch {
      /* */
    }
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

  return {
    connected,
    chatMessages,
    events,
    send,
    disconnect,
    resolvedPaintingId,
  };
}
