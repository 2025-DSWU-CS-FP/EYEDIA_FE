import { useMemo, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import MessageList from '@/components/chat/MessageList';
import Divider from '@/components/mypage/Divider';
import { useToast } from '@/contexts/ToastContext';
import Header from '@/layouts/Header';
import useChatMessages from '@/services/queries/useChatMessages';
import type { ChatMessage } from '@/types';

const PAINTING_ID = 419;

const makeStableId = (sender: string, createdAt?: string, content?: string) => {
  const raw = `${sender}|${createdAt ?? ''}|${content ?? ''}`;
  return `srv-${encodeURIComponent(raw).slice(0, 120)}`;
};

const adapt = (m: ChatMessage) => {
  const sender =
    (m as unknown as { sender?: string }).sender === 'ASSISTANT'
      ? 'BOT'
      : 'USER';
  const content = (m as unknown as { content?: string }).content ?? '';
  const createdAt = (m as unknown as { createdAt?: string }).createdAt ?? '';
  const id =
    (m as unknown as { id?: string | number }).id !== undefined
      ? String((m as unknown as { id?: string | number }).id)
      : makeStableId(sender, createdAt, content);
  return {
    id,
    sender: sender as 'USER' | 'BOT' | 'SYSTEM',
    type: 'TEXT' as const,
    content,
  };
};

export default function ChatHistoryPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useChatMessages(PAINTING_ID);
  const wsList = useMemo(() => (data ?? []).map(adapt), [data]);

  return (
    <section className="relative mx-auto flex min-h-dvh w-full max-w-[43rem] flex-col bg-gray-5 text-gray-100">
      <header className="sticky top-0 z-[1] w-full border-b-2 border-gray-10 bg-gray-5">
        <Header
          onBackClick={() => navigate(-1)}
          showBackButton
          backgroundColorClass="bg-gray-5"
        />
        <div className="px-[2.3rem] pb-[1rem]">
          <h1 className="t3">채팅 기록</h1>
          <p className="text-gray-70 ct5">작품 ID {PAINTING_ID}</p>
        </div>
        <Divider />
      </header>

      {isLoading && (
        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-60 ct3">기록을 불러오는 중…</p>
        </main>
      )}

      {isError && (
        <main className="flex flex-1 items-center justify-center">
          <p className="text-brand-red ct3">기록을 불러오지 못했어요.</p>
        </main>
      )}

      {!isLoading && !isError && (
        <main className="flex flex-1">
          {wsList.length === 0 ? (
            <div className="mx-auto flex w-full max-w-[43rem] flex-1 items-center justify-center px-[2rem]">
              <p className="text-gray-60 ct3">아직 채팅 기록이 없어요.</p>
            </div>
          ) : (
            <MessageList
              wsList={wsList}
              localMessages={[]}
              typing={false}
              onExtract={quote => {
                if (!quote.trim()) return;
                showToast(
                  '발췌가 복사되었어요. 스크랩에서 저장할 수 있어요.',
                  'info',
                );
              }}
              listRef={listRef}
              endRef={endRef}
            />
          )}
        </main>
      )}
    </section>
  );
}
