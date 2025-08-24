import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import connectedIcon from '@/assets/images/chat/connected-eyewear.png';
import disconnectedIcon from '@/assets/images/chat/disconnected-eyewear.png';
import ringImage from '@/assets/images/chat/eyewear-ring.svg';
import BottomLink from '@/components/chat/BottomLink';
import EyewearImage from '@/components/chat/EyewearImage';
import OnboardingText from '@/components/chat/OnboardingText';
import Header from '@/layouts/Header';

import '@/styles/eyewear-transition.css';

function OnboardingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsConnected(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = isConnected
      ? window.setTimeout(() => navigate('/chat-gaze'), 3000)
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
        <BottomLink
          text="연결에 문제가 있나요?"
          onClick={() => navigate('/help')}
        />
      )}
    </div>
  );
}

export default OnboardingPage;
