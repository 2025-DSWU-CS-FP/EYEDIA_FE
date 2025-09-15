export type MsgType = 'TEXT' | 'IMAGE';

export type LocalMsg = {
  id: string;
  sender: 'USER' | 'BOT';
  type: MsgType;
  content?: string;
  imageUrl?: string;
};
