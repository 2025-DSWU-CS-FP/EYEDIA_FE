import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Sample from '@/assets/images/sample/chat-gaze.png';
import BackButton from '@/components/common/BackButton';
import Button from '@/components/common/Button';
// import useConfirmPainting from '@/services/mutations/useConfirmPainting';

const artworkInfo = {
  title: 'In Bed (2005)',
  artist: '론 뮤익 (Ron Mueck)',
};

function GazePage() {
  const navigate = useNavigate();
  // const { mutate } = useConfirmPainting();
  const [trackingComplete, setTrackingComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTrackingComplete(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartConversation = () => {
    // mutate(4, {
    //   onSuccess: () => {
    //     navigate('/chat-artwork');
    //   },
    //   onError: () => {},
    // });
    navigate('/chat-artwork');
  };

  return (
    <div className="relative flex h-svh w-full flex-col items-center justify-around overflow-auto text-white">
      <BackButton className="text-gray-100" />
      <div className="w-[30.7rem] space-y-[2.2rem]">
        <div className="mx-auto flex flex-col gap-[0.4rem]">
          {trackingComplete ? (
            <div className="mt-6 text-ct2 font-medium text-brand-blue">
              시선추적 성공!
            </div>
          ) : (
            <div className="mt-6 text-ct2 font-medium text-gray-60">
              시선추적중...
            </div>
          )}
          <div className="mt-2 whitespace-pre-line text-t3 text-gray-100">
            {trackingComplete
              ? '지금 보고 있는 작품으로\n대화를 시작해볼까요?'
              : '궁금한 작품을\n2초 이상 응시하세요.'}
          </div>
        </div>
        <div className="relative h-[43.5rem] w-[30.7rem] self-center overflow-hidden rounded-2xl">
          {trackingComplete ? (
            <div className="relative h-full w-full">
              <img
                src={Sample}
                alt={artworkInfo.title}
                className="h-full w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/0 via-black/40 to-black/80" />
              {trackingComplete && (
                <div className="absolute bottom-[2.5rem] left-[2rem] space-y-[0.4rem] text-left">
                  <div className="text-t3 text-white">{artworkInfo.title}</div>
                  <div className="text-ct4 text-white/80">
                    {artworkInfo.artist}
                  </div>
                </div>
              )}
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

      {trackingComplete && (
        <div className="w-full px-[2rem]">
          <Button
            type="button"
            onClick={handleStartConversation}
            className="mt-[6rem] text-bt2"
          >
            대화 시작하기
          </Button>
        </div>
      )}
    </div>
  );
}

export default GazePage;
