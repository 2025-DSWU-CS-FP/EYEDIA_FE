import { useEffect, useState } from 'react';

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

const TARGET_PAINTING_ID = 200001;

export default function OnboardingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  // 온보딩 단계에서는 방 입장용 paintingId를 미리 정해 연결
  const token = getAuthToken();
  const { connected, send } = useStompChat({
    paintingId: TARGET_PAINTING_ID,
    token,
  });

  // 연결 상태를 UI에 반영
  useEffect(() => {
    if (connected) setIsConnected(true);
  }, [connected]);

  useEffect(() => {
    const timer = isConnected
      ? window.setTimeout(
          () =>
            navigate('/chat-gaze', {
              state: { paintingId: TARGET_PAINTING_ID },
            }),
          3000,
        )
      : null;

    return () => {
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [isConnected, navigate]);

  return (
    <div className="relative flex h-dvh flex-col items-center overflow-hidden bg-gradient-to-br from-blue-50 to-slate-300">
      <Header showBackButton backgroundColorClass="bg-transperate" />
      <div className="w-full px-4 pt-[10rem]">
        <OnboardingText
          text={
            isConnected
              ? '아이웨어 연결에 성공하였습니다.'
              : '전용 아이웨어를 착용하고 연결해주세요.'
          }
        />

        <div className="relative mx-auto flex h-[24rem] w-[30rem] items-center justify-center">
          <img
            src={ringImage}
            alt="background ring"
            className="pointer-events-none absolute -bottom-[5rem] h-[23rem] w-[30rem] opacity-70"
          />
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={isConnected ? 'connected' : 'disconnected'}
              timeout={300}
              classNames="fade"
            >
              <EyewearImage
                src={isConnected ? connectedIcon : disconnectedIcon}
                alt={isConnected ? '연결된 아이웨어' : '아이웨어 연결 전'}
              />
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>

      {!isConnected && (
        <div className="flex w-full flex-col items-center gap-[1rem] pb-[2rem]">
          <BottomLink
            text="연결에 문제가 있나요?"
            onClick={() => navigate('/help')}
          />
          {/* 임시 연결 버튼: STOMP 연결 후 테스트 메시지를 발행 */}
          <button
            type="button"
            className="rounded-[24px] bg-gray-10 px-[1.6rem] py-[0.8rem] text-gray-100 bd2"
            onClick={() => {
              // 연결은 useStompChat가 이미 시도하고 있음. 임시로 메시지를 보내 서버 라우팅 확인
              // 공개 채널: /app/chat.sendMessage 로 { paintingId, content } 발행
              send('onboarding: 연결 테스트');
            }}
          >
            임시 연결 시작
          </button>
        </div>
      )}
    </div>
  );
}
