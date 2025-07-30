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
    <div className="py-22 fixed inset-0 left-1/2 z-10 flex w-full max-w-[425px] -translate-x-1/2 items-center justify-center bg-black/60 px-10">
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="fixed right-5 top-5 z-10 p-1 text-2xl text-white"
      >
        <IoClose />
      </button>

      <div>
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={src}
            alt="작품 상세"
            className="w-full rounded-2xl object-cover"
          />

          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-black/0 to-black/70" />

          <div className="absolute bottom-0 left-0 z-10 w-full p-4 text-white">
            <div className="inline-flex flex-col items-start justify-end gap-4">
              <div className="flex flex-col items-start justify-start gap-3.5">
                <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                  <div className="font-['Pretendard'] text-xl font-medium text-white">
                    {title}
                  </div>
                  <div className="font-['Pretendard'] text-base font-medium text-white">
                    {artist}
                  </div>
                </div>
                <div className="font-['Pretendard'] text-xs font-normal text-neutral-400">
                  마지막 대화: {lastChatDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button onClick={onContinueChat}>대화 이어하기</Button>
        </div>
      </div>
    </div>
  );
}
