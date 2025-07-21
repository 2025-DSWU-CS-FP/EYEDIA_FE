import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import connectedIcon from '@/assets/images/chat/connected-eyewear.png';
import disconnectedIcon from '@/assets/images/chat/disconnected-eyewear.png';
import ringImage from '@/assets/images/chat/eyewear-ring.svg';
import BottomLink from '@/components/chat/BottomLink';
import EyewearImage from '@/components/chat/EyewearImage';
import OnboardingText from '@/components/chat/OnboardingText';
import BackButton from '@/components/common/BackButton';

import '@/styles/eyewear-transition.css';

function OnboardingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        navigate('/chat-gaze');
      }, 3000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isConnected, navigate]);

  return (
    <div className="flex relative flex-col justify-around items-center max-h-[100vh] h-[100vh] overflow-hidden bg-gradient-to-br from-blue-50 to-slate-300 -mb-6">
      <BackButton className="text-black" />
      <div className="w-full px-4">
        <OnboardingText
          text={
            isConnected
              ? '아이웨어 연결에 성공하였습니다.'
              : '전용 아이웨어를 착용하고 연결해주세요.'
          }
        />
        <div className="relative flex justify-center w-[20.9rem] h-[20.9rem] items-center mx-auto">
          <img
            src={ringImage}
            alt="background ring"
            className="absolute w-[20.9rem] h-[20.9rem] -bottom-[5rem] opacity-70"
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

        {!isConnected && (
          <button
            type="button"
            onClick={() => setIsConnected(true)}
            className="mt-6 w-full bg-white/30 text-white py-2 rounded-md text-sm"
          >
            연결됨으로 설정 (임시)
          </button>
        )}
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
