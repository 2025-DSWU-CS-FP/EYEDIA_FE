import { useState } from 'react';

import connectedIcon from '@/assets/images/chat/connected-eyewear.png';
import disconnectedIcon from '@/assets/images/chat/disconnected-eyewear.png';
import BottomLink from '@/components/chat/BottomLink';
import EyewearImage from '@/components/chat/EyewearImage';
import OnboardingText from '@/components/chat/OnboardingText';

function OnboardingPage() {
  const [isConnected, setIsConnected] = useState(false);

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
        <EyewearImage
          src={isConnected ? connectedIcon : disconnectedIcon}
          alt={isConnected ? '연결된 아이웨어' : '아이웨어 연결 전'}
        />
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
          onClick={() => alert('도움말 페이지로 이동')}
        />
      )}
    </div>
  );
}

export default OnboardingPage;
