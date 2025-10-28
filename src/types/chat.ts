export type Sender = 'USER' | 'BOT' | 'SYSTEM';

export type IncomingChat = {
  id?: string;
  paintingId: number;
  content: string;
  sender: Sender;
  createdAt: string;
};

export type OutgoingChat = {
  paintingId: number;
  content: string;
};
