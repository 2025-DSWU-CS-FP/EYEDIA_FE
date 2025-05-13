import { useState } from 'react';

import connectedIcon from '@/assets/images/chat/connected-eyewear.png';
import disconnectedIcon from '@/assets/images/chat/disconnected-eyewear.png';
import BottomLink from '@/components/chat/BottomLink';
import EyewearImage from '@/components/chat/EyewearImage';
import OnboardingText from '@/components/chat/OnboardingText';

function OnboardingPage() {
  const [isConnected] = useState(false);

  return (
    <div className="flex flex-col justify-between items-center h-screen bg-black text-white pt-16 pb-6">
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
