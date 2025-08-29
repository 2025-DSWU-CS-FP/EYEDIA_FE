import Player from 'lottie-react';
import { useNavigate } from 'react-router-dom';

import editLottie from '@/assets/lottie/edit-profile.json';
import Button from '@/components/common/Button';
import Header from '@/layouts/Header';

function HelpPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="도움말" showBackButton backgroundColorClass="gray-5" />
      <div className="flex flex-col items-center gap-[1.6rem] pt-[5rem]">
        <Player
          autoplay
          loop
          animationData={editLottie}
          className="w-[12.5rem]"
        />
        <div className="flex w-full max-w-[38rem] flex-col gap-[3.2rem] rounded-[15px] px-[2.4rem]">
          <div className="flex flex-col gap-[1rem] text-center">
            <span className="t4">아이웨어 연결이 되지 않나요?</span>
            <span className="ct1">아래 내용을 확인해보세요.</span>
          </div>
          <ul className="list-inside list-disc space-y-2 text-left text-[1.4rem]">
            <li>블루투스가 켜져 있는지 확인해주세요.</li>
            <li>아이웨어 전원이 켜져 있는지 확인해주세요.</li>
            <li>블루투스 접근이 허용되어 있는지 확인하세요.</li>
            <li>그래도 안 된다면 기기를 재시작해보세요.</li>
          </ul>
          <Button className="w-full bg-brand-blue" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
