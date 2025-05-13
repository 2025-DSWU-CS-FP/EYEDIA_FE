import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Sample from '@/assets/images/sample/chat-gaze.png';
import BackButton from '@/components/common/BackButton';

function GazePage() {
  const navigate = useNavigate();
  const [trackingComplete, setTrackingComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTrackingComplete(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartConversation = () => {
    navigate('/chat-artwork');
  };

  return (
    <div className="w-full max-h-[100vh] h-[100vh] overflow-hidden bg-neutral-900 text-white px-6 py-10 relative flex flex-col items-center">
      <div className="flex w-full justify-start">
        <BackButton className="text-white" />
      </div>
      <div className="w-full max-w-xs flex flex-col">
        {trackingComplete ? (
          <div className="mt-6 text-xs font-medium text-[#E15D6A]">
            시선추적 성공!
          </div>
        ) : (
          <div className="mt-6 text-xs font-medium text-zinc-500">
            시선추적중...
          </div>
        )}
        <div className="mt-2 text-xl leading-7 whitespace-pre-line">
          {trackingComplete
            ? '지금 보고 있는 작품으로\n대화를 시작해볼까요?'
            : '궁금한 작품을\n2초 이상 응시하세요.'}
        </div>

        <div className="mt-6 w-80 h-96 rounded-2xl relative overflow-hidden self-center">
          {trackingComplete ? (
            <div className="relative w-full h-full">
              <img
                src={Sample}
                alt="In Bed"
                className="rounded-2xl object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/80 opacity-60 rounded-2xl" />
            </div>
          ) : (
            <div
              className="absolute inset-0 rounded-2xl flex justify-center items-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(75, 12, 233, 0.12) 0%, rgba(217, 20, 23, 0.12) 100%)',
              }}
            >
              <div className="flex gap-2 items-end">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce-delay-1" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce-delay-2" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce-delay-3" />
              </div>
            </div>
          )}
        </div>

        {trackingComplete && (
          <div className="mt-4">
            <div className="text-xl">In Bed(2005)</div>
            <div className="text-xs text-white/80">론 뮤익(Ron Mueck)</div>
          </div>
        )}
      </div>

      {trackingComplete && (
        <button
          type="button"
          onClick={handleStartConversation}
          className="mt-10 w-full bg-white text-black py-3 rounded-md text-base font-semibold"
        >
          대화 시작하기
        </button>
      )}
    </div>
  );
}

export default GazePage;
