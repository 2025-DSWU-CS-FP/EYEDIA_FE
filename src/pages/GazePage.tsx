import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

function GazePage() {
  const navigate = useNavigate();
  const [trackingComplete, setTrackingComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTrackingComplete(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartConversation = () => {
    navigate('/artwork');
  };

  return (
    <div className="w-full max-h-[95vh] h-[95vh] -mb-6 bg-neutral-900 text-white px-6 py-4 relative">
      <div className="mt-6 text-xs font-medium text-zinc-500">
        {trackingComplete ? '시선추적 성공!' : '시선추적중...'}
      </div>
      <div className="mt-2 text-xl leading-7 whitespace-pre-line">
        {trackingComplete
          ? '지금 보고 있는 작품으로\n대화를 시작해볼까요?'
          : '궁금한 작품을\n2초 이상 응시하세요.'}
      </div>

      <div className="mt-6 w-80 h-96 bg-neutral-800/60 rounded-2xl flex justify-center items-center">
        {trackingComplete ? (
          <img
            src="/images/artwork/inbed.png"
            alt="In Bed"
            className="rounded-2xl object-cover w-full h-full"
          />
        ) : (
          <div className="flex gap-2 items-end">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce-delay-1" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce-delay-2" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce-delay-3" />
          </div>
        )}
      </div>

      {trackingComplete && (
        <div className="mt-4">
          <div className="text-xl">In Bed(2005)</div>
          <div className="text-xs text-white/80">론 뮤익(Ron Mueck)</div>
        </div>
      )}

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
