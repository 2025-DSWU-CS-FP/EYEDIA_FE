import { IoClose } from 'react-icons/io5';

import Button from '@/components/common/Button';

interface ArtworkDetailModalProps {
  src: string;
  title: string;
  artist: string;
  lastChatDate: string;
  onClose: () => void;
  onContinueChat: () => void;
}

export default function ArtworkDetailModal({
  src,
  title,
  artist,
  lastChatDate,
  onClose,
  onContinueChat,
}: ArtworkDetailModalProps) {
  return (
    <div className="fixed inset-0 z-10 left-1/2 max-w-[425px] w-full -translate-x-1/2 flex items-center justify-center bg-black/60 px-10 py-22">
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="fixed top-5 right-5 z-10 text-white text-2xl p-1"
      >
        <IoClose />
      </button>

      <div>
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={src}
            alt="작품 상세"
            className="w-full object-cover rounded-2xl"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 rounded-2xl pointer-events-none" />

          <div className="absolute bottom-0 left-0 w-full p-4 text-white z-10">
            <div className="inline-flex flex-col justify-end items-start gap-4">
              <div className="flex flex-col justify-start items-start gap-3.5">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="text-white text-xl font-medium font-['Pretendard']">
                    {title}
                  </div>
                  <div className="text-white text-base font-medium font-['Pretendard']">
                    {artist}
                  </div>
                </div>
                <div className="text-neutral-400 text-xs font-normal font-['Pretendard']">
                  마지막 대화: {lastChatDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={onContinueChat}>대화 이어하기</Button>
        </div>
      </div>
    </div>
  );
}
