export interface ChatMessage {
  sender: 'ASSISTANT' | 'USER';
  content: string;
  paintingId: number;
  chatType: string | null;
  timestamp: string;
}

export interface ConfirmPaintingResponse {
  chatRoomId: number;
  aiPaintingId: number;
  confirmed: boolean;
  message: string;
}
