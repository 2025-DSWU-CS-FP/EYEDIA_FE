import { Client } from '@stomp/stompjs';

type Params = { url: string; token?: string };

export default function makeStompClient({ url, token }: Params) {
  const client = new Client({
    brokerURL: url,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 1000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {},
  });
  return client;
}
