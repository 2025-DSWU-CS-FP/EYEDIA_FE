import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Sample from '@/assets/images/chat/image1.jpg';
import Button from '@/components/common/Button';
import useStompChat from '@/hooks/use-stomp-chat';
import Header from '@/layouts/Header';
import useConfirmPainting from '@/services/mutations/useConfirmPainting';
import getAuthToken from '@/utils/getToken';

type DetectedEvent = {
  paintingId: number;
  imgUrl?: string;
  title?: string;
  artist?: string;
  description?: string;
  exhibition?: string;
  artId?: number;
};

const FALLBACK_PAINTING_ID = 200001;

export default function GazePage() {
  const navigate = useNavigate();
  const token = getAuthToken();

  const [trackingComplete, setTrackingComplete] = useState(false);
  const [detected, setDetected] = useState<DetectedEvent | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setTrackingComplete(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  const queue = useMemo(
    () => ({
      destinations: ['/queue/events'],
      onMessage: (payload: unknown) => {
        try {
          const e = payload as Partial<DetectedEvent>;
          if (typeof e?.paintingId === 'number') {
            setDetected({
              paintingId: e.paintingId,
              imgUrl: e.imgUrl,
              title: e.title,
              artist: e.artist,
              description: e.description,
              exhibition: e.exhibition,
              artId: e.artId,
            });
          }
        } catch {
          /* ignore */
        }
      },
    }),
    [],
  );

  useStompChat({
    paintingId: FALLBACK_PAINTING_ID,
    token,
    queue,
  });

  const { mutate: confirmPainting, isPending } = useConfirmPainting();

  const handleStartConversation = () => {
    const pid = detected?.paintingId ?? FALLBACK_PAINTING_ID;
    confirmPainting(pid); // 대기하지 않고 발사

    // Artwork로 작품 컨텍스트 전달(artId가 있으면 같이 넘김)
    navigate('/chat-artwork', {
      state: {
        paintingId: pid,
        artId: detected?.artId ?? pid,
        title: detected?.title,
        artist: detected?.artist,
        imgUrl: detected?.imgUrl,
        description: detected?.description,
        exhibition: detected?.exhibition,
      },
    });
  };

  const title = detected?.title ?? '작품 인식 중';
  const artist = detected?.artist ?? '';
  const currentImg = detected?.imgUrl ?? Sample;
  const currentId = detected?.paintingId ?? FALLBACK_PAINTING_ID;

  return (
    <>
      <section className="relative flex max-h-dvh w-full flex-col items-center justify-start pb-[3rem] text-white">
        <Header showBackButton backgroundColorClass="bg-gray-5" />
        <div className="w-[30.7rem] space-y-[2.2rem]">
          <div className="mx-auto flex flex-col justify-between gap-[0.4rem]">
            {trackingComplete ? (
              <div className="font-medium text-brand-blue ct2">
                시선추적 성공!
              </div>
            ) : (
              <div className="font-medium text-gray-60 ct2">시선추적중...</div>
            )}
            <div className="mt-2 whitespace-pre-line text-gray-100 t3">
              {trackingComplete
                ? `지금 보고 있는 작품으로\n대화를 시작해볼까요?`
                : '궁금한 작품을\n2초 이상 응시하세요.'}
            </div>
          </div>

          <div className="relative h-[43.5rem] w-[30.7rem] self-center overflow-hidden rounded-2xl">
            {trackingComplete ? (
              <div className="relative h-full w-full">
                <img
                  src={currentImg}
                  alt={title}
                  className="h-full w-full rounded-2xl object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/0 via-black/40 to-black/80" />
                <div className="absolute bottom-[2.5rem] left-[2rem] space-y-[0.4rem] text-left">
                  <div className="text-white t3">{title}</div>
                  {artist && <div className="text-white/80 ct4">{artist}</div>}
                  <div className="text-white/70 ct5">ID: {currentId}</div>
                </div>
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
      </section>

      {trackingComplete && (
        <div className="sticky w-full px-[3rem] pb-[2rem]">
          <Button
            type="button"
            onClick={handleStartConversation}
            className="mt-[3rem] bg-brand-blue bt2"
            disabled={isPending}
            aria-busy={isPending}
          >
            대화 시작하기
          </Button>
        </div>
      )}
    </>
  );
}
