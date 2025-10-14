import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import connectedIcon from '@/assets/images/chat/connected-eyewear.png';
import disconnectedIcon from '@/assets/images/chat/disconnected-eyewear.png';
import ringImage from '@/assets/images/chat/eyewear-ring.svg';
import BottomLink from '@/components/chat/BottomLink';
import EyewearImage from '@/components/chat/EyewearImage';
import OnboardingText from '@/components/chat/OnboardingText';
import useStompChat from '@/hooks/use-stomp-chat';
import Header from '@/layouts/Header';
import '@/styles/eyewear-transition.css';
import getAuthToken from '@/utils/getToken';

type QueueEvent = {
  paintingId?: number;
  imgUrl?: string;
  title?: string;
  artist?: string;
  description?: string;
  exhibition?: string;
  artId?: number;
};

export default function OnboardingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [detected, setDetected] = useState<QueueEvent | null>(null);
  const navigate = useNavigate();
  const token = getAuthToken();

  const { connected, messages } = useStompChat({
    paintingId: 0,
    token,
    topic: '/queue/events',
    onConnected: headers => {
      setIsConnected(true);
      const uid = headers['user-name'] as string | undefined;
      if (uid) setUserId(uid);
    },
  });

  useEffect(() => {
    const items = Array.isArray(messages)
      ? (messages as unknown as QueueEvent[])
      : [];
    const next = items.find(e => typeof e?.paintingId === 'number');
    if (next) {
      setDetected({
        paintingId: next.paintingId,
        imgUrl: next.imgUrl,
        title: next.title,
        artist: next.artist,
        description: next.description,
        exhibition: next.exhibition,
        artId: next.artId,
      });
    }
  }, [messages]);

  useEffect(() => {
    let t: number | undefined;
    if (detected?.paintingId) {
      t = window.setTimeout(() => {
        navigate('/chat-gaze', {
          state: {
            userId,
            paintingId: detected.paintingId,
            artId: detected.artId ?? detected.paintingId,
            title: detected.title,
            artist: detected.artist,
            imgUrl: detected.imgUrl,
            description: detected.description,
            exhibition: detected.exhibition,
          },
        });
      }, 3000);
    }
    return () => {
      if (t !== undefined) window.clearTimeout(t);
    };
  }, [detected, userId, navigate]);

  const text = useMemo(
    () =>
      connected || isConnected
        ? '아이웨어 연결에 성공하였습니다.'
        : '전용 아이웨어를 착용하고 연결해주세요.',
    [connected, isConnected],
  );

  return (
    <section className="relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-slate-300">
      <Header
        showBackButton
        backgroundColorClass="bg-transparent"
        onBackClick={() => navigate(-1)}
      />
      <div className="flex h-dvh w-full flex-col justify-center">
        <OnboardingText text={text} />
        <div className="relative mx-auto flex h-[24rem] w-[30rem] items-center justify-center pb-[45%]">
          <img
            src={ringImage}
            alt="background ring"
            className="pointer-events-none absolute bottom-[5rem] h-[23rem] w-[30rem] opacity-70"
          />
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={connected || isConnected ? 'connected' : 'disconnected'}
              timeout={300}
              classNames="fade"
            >
              <EyewearImage
                src={
                  connected || isConnected ? connectedIcon : disconnectedIcon
                }
                alt={
                  connected || isConnected
                    ? '연결된 아이웨어'
                    : '아이웨어 연결 전'
                }
              />
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>

      {!connected && !isConnected && (
        <div className="flex w-full flex-col items-center gap-[1rem] pb-[2rem]">
          <BottomLink
            text="연결에 문제가 있나요?"
            onClick={() => navigate('/help')}
          />
        </div>
      )}
    </section>
  );
}
