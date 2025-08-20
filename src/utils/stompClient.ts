import { Client } from '@stomp/stompjs';

export const getAccessToken = () => {
  const raw = localStorage.getItem('accessToken') ?? '';
  return raw.trim().replace(/^"|"$/g, '');
};

export const ROOM_TOPIC = (id: string | number) => `/room/${id}`;
export const CHAT_PUB = (id: string | number) => `/app/chat/${id}`;

export const makeStompClient = (token: string) =>
  new Client({
    brokerURL: 'wss://eyedia.site/ws-stomp',
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    connectHeaders: { Authorization: `Bearer ${token}` },
    debug: m => console.log('📜 DEBUG:', m),
  });
