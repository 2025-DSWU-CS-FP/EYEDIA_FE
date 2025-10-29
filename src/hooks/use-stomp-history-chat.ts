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

  useEffect(
    function syncConnectedCb() {
      onConnectedRef.current = onConnected;
    },
    [onConnected],
  );

  useEffect(
    function syncRoomCb() {
      onRoomMessageRef.current = onRoomMessage;
    },
    [onRoomMessage],
  );

  useEffect(
    function syncPid() {
      if (externalPaintingId && externalPaintingId !== resolvedPaintingId) {
        setResolvedPaintingId(externalPaintingId);
      }
    },
    [externalPaintingId, resolvedPaintingId],
  );

  const safeUnsubscribe = (
    getRef: () => StompSubscription | null,
    clear: () => void,
  ) => {
    const sub = getRef();
    if (sub) {
      try {
        sub.unsubscribe();
      } catch (e) {
        console.debug('unsubscribe ignore', e);
      }
      clear();
    }
  };

  const safeDeactivate = (
    client: ReturnType<typeof makeStompClient> | null,
  ) => {
    if (client) {
      try {
        client.deactivate();
      } catch {
        /* */
      }
    }
  };

  useEffect(
    function connectEffect() {
      const url = import.meta.env.VITE_WS_URL as string | undefined;

      const wantsQueueEvents = topicOverride === '/queue/events';
      const hasPid =
        typeof externalPaintingId === 'number' && externalPaintingId > 0;
      const canActivate =
        Boolean(url) && Boolean(token) && (hasPid || wantsQueueEvents);

      const cleanup = () => {
        safeUnsubscribe(
          () => eventsSubRef.current,
          () => {
            eventsSubRef.current = null;
          },
        );
        safeUnsubscribe(
          () => chatSubRef.current,
          () => {
            chatSubRef.current = null;
          },
        );
        safeUnsubscribe(
          () => roomSubRef.current,
          () => {
            roomSubRef.current = null;
          },
        );
        safeDeactivate(clientRef.current);
        clientRef.current = null;
        setConnected(false);
      };

      if (!canActivate) {
        return cleanup;
      }

      const client = makeStompClient({ url: url!, token });
      clientRef.current = client;

      const subscribeChatAndRoom = (pid: number) => {
        safeUnsubscribe(
          () => chatSubRef.current,
          () => {
            chatSubRef.current = null;
          },
        );
        safeUnsubscribe(
          () => roomSubRef.current,
          () => {
            roomSubRef.current = null;
          },
        );

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

          roomSubRef.current = client.subscribe(
            `/room/${pid}`,
            (f: IMessage) => {
              onRoomMessageRef.current?.(f);
            },
          );
        }
      };

      client.onConnect = (frame: IFrame) => {
        setConnected(true);
        onConnectedRef.current?.(frame.headers);

        if (wantsQueueEvents) {
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
        } else if (resolvedPaintingId) {
          subscribeChatAndRoom(resolvedPaintingId);
        }
      };

      client.onStompError = () => {
        // eslint-disable-next-line no-console
        console.debug('STOMP error');
      };
      client.onWebSocketClose = () => setConnected(false);

      client.activate();

      // 항상 cleanup 반환(consistent-return)
      return cleanup;
    },
    [token, topicOverride, externalPaintingId, resolvedPaintingId],
  );

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
    safeUnsubscribe(
      () => eventsSubRef.current,
      () => {
        eventsSubRef.current = null;
      },
    );
    safeUnsubscribe(
      () => chatSubRef.current,
      () => {
        chatSubRef.current = null;
      },
    );
    safeUnsubscribe(
      () => roomSubRef.current,
      () => {
        roomSubRef.current = null;
      },
    );
    safeDeactivate(clientRef.current);
    clientRef.current = null;
    setConnected(false);
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
