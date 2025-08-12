import { useEffect, useRef, useState } from 'react';

import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

import Sample from '@/assets/images/sample/chat-gaze.png';
import Button from '@/components/common/Button';
import Header from '@/layouts/Header';

// import useConfirmPainting from '@/services/mutations/useConfirmPainting';

type ArtworkInfo = { title: string; artist: string; imageUrl?: string };

export default function GazePage() {
  const navigate = useNavigate();

  // const { mutate } = useConfirmPainting();
  const [trackingComplete, setTrackingComplete] = useState(false);
  const [artworkInfo, setArtworkInfo] = useState<ArtworkInfo>({
    title: 'In Bed (2005)',
    artist: '론 뮤익 (Ron Mueck)',
    imageUrl: Sample,
  });

  const clientRef = useRef<Client | null>(null);
  const ROOM_ID = '2';

  useEffect(() => {
    const raw = localStorage.getItem('accessToken') ?? '';
    const token = raw.trim().replace(/^"|"$/g, '');

    const client = new Client({
      brokerURL: 'wss://eyedia.site/ws-stomp',
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: m => console.log('📜 DEBUG:', m),

      onConnect: () => {
        console.log('✅ STOMP 연결 성공');

        client.subscribe(`/room/${ROOM_ID}`, (m: IMessage) => {
          console.log('📩 수신:', m.body);
          // 에코는 문자열, 페인팅 푸시는 JSON일 수 있으니 안전 파싱
          try {
            const payload = JSON.parse(m.body) as ArtworkInfo;
            setArtworkInfo(prev => ({
              title: payload.title ?? prev.title,
              artist: payload.artist ?? prev.artist,
              imageUrl: payload.imageUrl ?? prev.imageUrl,
            }));
            setTrackingComplete(true);
          } catch {
            // 문자열 에코면 여기로 옴
          }
        });

        client.publish({
          destination: `/app/echo/${ROOM_ID}`,
          body: '에코 테스트',
          headers: { 'content-type': 'text/plain' },
        });
      },

      onStompError: frame => {
        console.error('❌ STOMP ERROR', {
          command: frame.command,
          headers: frame.headers,
          body: frame.body,
        });
      },
      onWebSocketError: evt => console.error('🧨 WS 에러:', evt),
      onWebSocketClose: evt =>
        console.warn('🔌 WS 종료:', evt.code, evt.reason),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, []);

  const handleStartConversation = () => {
    // mutate(4, {
    //   onSuccess: () => {
    //     navigate('/chat-artwork');
    //   },
    //   onError: () => {},
    // });
    navigate('/chat-artwork');
  };

  return (
    <div className="relative flex max-h-svh w-full flex-col items-center justify-around overflow-auto pb-[3rem] text-white">
      <Header showBackButton backgroundColorClass="bg-transparent" />
      <div className="w-[30.7rem] space-y-[2.2rem]">
        {trackingComplete ? (
          <p className="text-ct2 font-medium text-brand-blue">시선추적 성공!</p>
        ) : (
          <p className="text-ct2 font-medium text-gray-60">시선추적중...</p>
        )}
        <h1 className="mt-2 whitespace-pre-line text-t3 text-gray-100">
          {trackingComplete
            ? '지금 보고 있는 작품으로\n대화를 시작해볼까요?'
            : '궁금한 작품을\n2초 이상 응시하세요.'}
        </h1>

        <div className="relative h-[43.5rem] w-[30.7rem] self-center overflow-hidden rounded-2xl">
          {trackingComplete ? (
            <div className="relative h-full w-full">
              <img
                src={Sample}
                alt={artworkInfo.title}
                className="h-full w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/0 via-black/40 to-black/80" />
              {trackingComplete && (
                <div className="absolute bottom-[2.5rem] left-[2rem] space-y-[0.4rem] text-left">
                  <div className="text-t3 text-white">{artworkInfo.title}</div>
                  <div className="text-ct4 text-white/80">
                    {artworkInfo.artist}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 to-blue-100">
              <div className="flex items-end gap-2">
                <div className="h-[1rem] w-[1rem] animate-bounce-delay-1 rounded-full bg-white" />
                <div className="h-[1rem] w-[1rem] animate-bounce-delay-2 rounded-full bg-white" />
                <div className="h-[1rem] w-[1rem] animate-bounce-delay-3 rounded-full bg-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {trackingComplete && (
        <div className="w-full px-[2rem]">
          <Button
            type="button"
            onClick={handleStartConversation}
            className="mt-[3rem] text-bt2"
          >
            대화 시작하기
          </Button>
        </div>
      )}
    </div>
  );
}
