export const PROMPT_MESSAGES = {
  checkingConnection: '연결을 확인하는 중이에요.',
  speaking: '말씀하세요 :)',
  generating: '답변을 생성하는 중이에요…',
  ask: '버튼을 누르고 작품에 대해 물어보세요.',
} as const;

export type PromptMessageKey = keyof typeof PROMPT_MESSAGES;
