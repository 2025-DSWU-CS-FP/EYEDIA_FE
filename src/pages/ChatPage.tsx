import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import connectedIcon from '@/assets/images/chat/connected-eyewear.png';
import disconnectedIcon from '@/assets/images/chat/disconnected-eyewear.png';
import ringImage from '@/assets/images/chat/eyewear-ring.svg';
import BottomLink from '@/components/chat/BottomLink';
import EyewearImage from '@/components/chat/EyewearImage';
import OnboardingText from '@/components/chat/OnboardingText';

import '@/styles/eyewear-transition.css';

function OnboardingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-around items-center max-h-[90vh] h-[90vh] bg-black text-white -mb-6">
      <div className="w-full px-4">
        <OnboardingText
          text={
            isConnected
              ? '아이웨어 연결에 성공하였습니다.'
              : '전용 아이웨어를 착용하고 연결해주세요.'
          }
        />
        <div className="relative flex justify-center items-center h-44">
          <img
            src={ringImage}
            alt="background ring"
            className="absolute w-[300px] h-auto bottom-[-10px] opacity-70"
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
        <button
          type="button"
          onClick={() => setIsConnected(prev => !prev)}
          className="bg-white/30 bottom-[20vh] text-black fixed px-4 py-2 rounded-md text-sm"
        >
          {isConnected ? '연결 해제' : '연결됨으로 설정'}
        </button>
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
