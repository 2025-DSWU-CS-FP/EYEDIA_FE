import { useEffect, useRef, useState } from 'react';

import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import Header from '@/layouts/Header';
import { getAccessToken, makeStompClient } from '@/utils/stompClient';

type ArtworkInfo = { title: string; artist: string; imageUrl?: string };

const BACKEND = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${BACKEND}/api/v1/paintings`;

const DEMO_ART_ID = Number(import.meta.env.VITE_DEMO_ART_ID ?? 1);

export default function GazePage() {
  const navigate = useNavigate();
  const [trackingComplete, setTrackingComplete] = useState(false);
  const [artworkInfo] = useState<ArtworkInfo>({
    title: 'In Bed (2005)',
    artist: '론 뮤익 (Ron Mueck)',
    imageUrl: undefined,
  });

  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    const client = makeStompClient(token);

    client.onConnect = () => setTrackingComplete(true);
    client.onStompError = f => console.error('❌ STOMP ERROR', f);
    client.onWebSocketError = e => console.error('🧨 WS 에러:', e);

    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, []);

  const handleStartConversation = async () => {
    const artId = DEMO_ART_ID;
    if (!artId) {
      alert('감지된 작품이 없습니다. 작품을 2초 이상 응시해주세요.');
      return;
    }

    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/${artId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? {
                Authorization: token.startsWith('Bearer ')
                  ? token
                  : `Bearer ${token}`,
              }
            : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { chatRoomId?: number; paintingId?: number } =
        await res.json();
      const roomId = String(data.chatRoomId ?? data.paintingId ?? '');
      if (!roomId) throw new Error('대화방 ID가 반환되지 않았습니다.');

      // 방 구독은 채팅 페이지에서 수행
      navigate(`/chat-artwork/${roomId}`, { state: { artwork: artworkInfo } });
    } catch (e: any) {
      console.error(e);
      alert(`채팅방 생성에 실패했습니다.\n${e.message ?? ''}`);
    }
  };

  return (
    <main className="relative flex max-h-svh w-full flex-col items-center justify-around overflow-auto pb-[3rem] text-white">
      <Header showBackButton backgroundColorClass="bg-transparent" />
      <section className="w-[30.7rem] space-y-[2.2rem]">
        <p
          className={`text-ct2 font-medium ${trackingComplete ? 'text-brand-blue' : 'text-gray-60'}`}
        >
          {trackingComplete ? '시선추적 성공!' : '시선추적중...'}
        </p>

        <h1 className="mt-2 whitespace-pre-line text-t3 text-gray-100">
          {trackingComplete
            ? '지금 보고 있는 작품으로\n대화를 시작해볼까요?'
            : '궁금한 작품을\n2초 이상 응시하세요.'}
        </h1>

        <article className="relative h-[43.5rem] w-[30.7rem] self-center overflow-hidden rounded-2xl">
          {trackingComplete ? (
            <div className="relative h-full w-full">
              <img
                src={artworkInfo.imageUrl}
                alt={artworkInfo.title}
                className="h-full w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/0 via-black/40 to-black/80" />
              <div className="absolute bottom-[2.5rem] left-[2rem] space-y-[0.4rem] text-left">
                <div className="text-t3 text-white">{artworkInfo.title}</div>
                <div className="text-ct4 text-white/80">
                  {artworkInfo.artist}
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 to-blue-100">
              <div className="flex items-end gap-[0.2rem]">
                <span className="h-[1rem] w-[1rem] animate-bounce-delay-1 rounded-full bg-white" />
                <span className="h-[1rem] w-[1rem] animate-bounce-delay-2 rounded-full bg-white" />
                <span className="h-[1rem] w-[1rem] animate-bounce-delay-3 rounded-full bg-white" />
              </div>
            </div>
          )}
        </article>
      </section>

      {trackingComplete && (
        <footer className="w-full px-[2rem]">
          <Button
            type="button"
            onClick={handleStartConversation}
            className="mt-[3rem] text-bt2"
          >
            대화 시작하기
          </Button>
        </footer>
      )}
    </main>
  );
}
