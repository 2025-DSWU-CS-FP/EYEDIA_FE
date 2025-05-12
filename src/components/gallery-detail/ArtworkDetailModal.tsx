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
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl overflow-hidden max-w-[90%]">
        <div className="relative">
          <img src={src} alt="작품 상세" className="w-full object-cover" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 text-white text-xl"
          >
            ✕
          </button>
        </div>
        <div className="p-4 text-white bg-black bg-opacity-60">
          <div className="text-lg font-bold">{title}</div>
          <div className="text-sm">{artist}</div>
          <div className="text-xs mt-1">마지막 대화: {lastChatDate}</div>
        </div>
        <button
          type="button"
          onClick={onContinueChat}
          className="w-full py-4 text-center text-lg font-semibold bg-white text-black"
        >
          대화 이어하기
        </button>
      </div>
    </div>
  );
}
