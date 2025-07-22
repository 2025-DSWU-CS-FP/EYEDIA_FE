import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Sample from '@/assets/images/sample/chat-gaze.png';
import BackButton from '@/components/common/BackButton';
import Button from '@/components/common/Button';
import useConfirmPainting from '@/services/mutations/useConfirmPainting';

const artworkInfo = {
  title: 'In Bed (2005)',
  artist: '론 뮤익 (Ron Mueck)',
};

function GazePage() {
  const navigate = useNavigate();
  const { mutate } = useConfirmPainting();
  const [trackingComplete, setTrackingComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTrackingComplete(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartConversation = () => {
    mutate(4, {
      onSuccess: () => {
        navigate('/chat-artwork');
      },
      onError: () => {},
    });
  };

  return (
    <div className="w-full max-h-svh justify-around overflow-auto text-white relative flex flex-col items-center">
      <BackButton className="text-gray-100" />
      <div className="space-y-[2.2rem] w-[30.7rem]">
        <div className="flex flex-col gap-[0.4rem] mx-auto">
          {trackingComplete ? (
            <div className="mt-6 text-ct2 font-medium text-brand-blue">
              시선추적 성공!
            </div>
          ) : (
            <div className="mt-6 text-ct2 font-medium text-gray-60">
              시선추적중...
            </div>
          )}
          <div className="mt-2 text-t3 whitespace-pre-line text-gray-100">
            {trackingComplete
              ? '지금 보고 있는 작품으로\n대화를 시작해볼까요?'
              : '궁금한 작품을\n2초 이상 응시하세요.'}
          </div>
        </div>
        <div className="w-[30.7rem] h-[43.5rem] rounded-2xl relative overflow-hidden self-center">
          {trackingComplete ? (
            <div className="relative w-full h-full">
              <img
                src={Sample}
                alt={artworkInfo.title}
                className="rounded-2xl object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/80 rounded-2xl" />
              {trackingComplete && (
                <div className="absolute bottom-[2.5rem] left-[2rem] text-left space-y-[0.4rem]">
                  <div className="text-t3 text-white">{artworkInfo.title}</div>
                  <div className="text-ct4 text-white/80">
                    {artworkInfo.artist}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-blue-100 rounded-2xl flex justify-center items-center">
              <div className="flex gap-2 items-end">
                <div className="w-[1rem] h-[1rem] bg-white rounded-full animate-bounce-delay-1" />
                <div className="w-[1rem] h-[1rem] bg-white rounded-full animate-bounce-delay-2" />
                <div className="w-[1rem] h-[1rem] bg-white rounded-full animate-bounce-delay-3" />
              </div>
            </div>
          )}
        </div>
      </div>

      {trackingComplete && (
        <Button
          type="button"
          onClick={handleStartConversation}
          className="mt-[6rem] w-[33rem] text-bt2"
        >
          대화 시작하기
        </Button>
      )}
    </div>
  );
}

export default GazePage;
