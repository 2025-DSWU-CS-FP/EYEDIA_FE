import { useEffect, useMemo, useState, useCallback } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import Sample from '@/assets/images/chat/image1.jpg';
import Button from '@/components/common/Button';
import useStompChat from '@/hooks/use-stomp-chat';
import Header from '@/layouts/Header';
import useConfirmPainting from '@/services/mutations/useConfirmPainting';

type LocationState = {
  userId?: string;
  paintingId?: number;
  imgUrl?: string;
  title?: string;
  artist?: string;
  description?: string;
  exhibition?: string;
  artId?: number;
};

export default function GazePage() {
  const { state } = useLocation();
  const s = (state as LocationState | null) ?? null;
  const navigate = useNavigate();
  const { mutate: confirmPainting, isPending } = useConfirmPainting();

  const hasDetected = typeof s?.paintingId === 'number';
  const pid = useMemo<number>(
    () => (typeof s?.paintingId === 'number' ? s.paintingId : -1),
    [s?.paintingId],
  );

  const [minSpinDone, setMinSpinDone] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMinSpinDone(true), 2000);
    return () => window.clearTimeout(t);
  }, []);

  const ready = hasDetected && minSpinDone;

  const title = s?.title ?? '작품 인식 중';
  const artist = s?.artist ?? '';
  const imgUrl = s?.imgUrl ?? Sample;

  useStompChat({ paintingId: pid });

  const headline = useMemo(
    () => (ready ? '시선추적 성공!' : '시선추적중...'),
    [ready],
  );
  const sub = useMemo(
    () =>
      ready
        ? `지금 보고 있는 작품으로\n대화를 시작해볼까요?`
        : '궁금한 작품을\n2초 이상 응시하세요.',
    [ready],
  );

  const handleStartConversation = useCallback(() => {
    if (pid < 0) return;
    confirmPainting(pid, {
      onSettled: () => {
        navigate('/chat-artwork', {
          state: {
            paintingId: pid,
            title: s?.title,
            artist: s?.artist,
            imgUrl: s?.imgUrl,
            description: s?.description,
            exhibition: s?.exhibition,
          },
          replace: true,
        });
      },
    });
  }, [
    confirmPainting,
    navigate,
    pid,
    s?.artist,
    s?.description,
    s?.exhibition,
    s?.imgUrl,
    s?.title,
  ]);

  return (
    <>
      <section className="relative flex max-h-dvh w-full flex-col items-center justify-start pb-[3rem] text-white">
        <Header showBackButton backgroundColorClass="bg-gray-5" />
        <div className="w-[30.7rem] space-y-[2.2rem]">
          <div className="mx-auto flex flex-col justify-between gap-[0.4rem]">
            <div className="font-medium text-brand-blue ct2">{headline}</div>
            <div className="mt-2 whitespace-pre-line text-gray-100 t3">
              {sub}
            </div>
          </div>

          <div className="relative h-[43.5rem] w-[30.7rem] self-center overflow-hidden rounded-2xl">
            {ready ? (
              <div className="relative h-full w-full">
                <img
                  src={imgUrl}
                  alt={title}
                  className="h-full w-full rounded-2xl object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/0 via-black/40 to-black/80" />
                <div className="absolute bottom-[2.5rem] left-[2rem] space-y-[0.4rem] text-left">
                  <div className="text-white t3">{title}</div>
                  {artist && <div className="text-white/80 ct4">{artist}</div>}
                  {pid >= 0 && (
                    <div className="text-white/70 ct5">ID: {pid}</div>
                  )}
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

      {ready && (
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
