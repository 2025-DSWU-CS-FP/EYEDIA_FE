import addIcon from '@/assets/icons/add-image.svg';
import shareIcon from '@/assets/icons/share-image.svg';
import BackButton from '@/components/common/BackButton';

interface ExtractCardProps {
  imageUrl: string;
  quote: string;
  title: string;
  artist: string;
  onSave: () => void;
  onShare: () => void;
}

export default function ExtractCard({
  imageUrl,
  quote,
  title,
  artist,
  onSave,
  onShare,
}: ExtractCardProps) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="mx-auto flex h-[100dvh] w-full max-w-[43rem] flex-col bg-gray-0">
        {/* 상단 */}
        <div className="px-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <BackButton className="text-gray-100" />
        </div>

        {/* 카드 */}
        <div className="relative mx-auto mt-6 h-[519px] w-[90%] overflow-hidden rounded-[28px]">
          <img
            src={imageUrl}
            alt="artwork"
            className="h-full w-full object-cover"
          />
          {/* 어둡게 */}
          <div className="absolute inset-0 bg-black/45" />

          {/* 좌측 상단 로고 */}
          <div className="absolute left-6 top-6 text-xs font-medium text-black">
            LOGO
          </div>

          {/* 인용문 */}
          <p className="absolute bottom-28 left-6 right-6 leading-relaxed text-white bd1">
            {quote}
          </p>

          {/* 구분선 */}
          <div className="absolute bottom-20 left-6 right-6 h-px bg-white/30" />

          {/* 제목/작가 */}
          <div className="absolute bottom-6 left-6 right-6 text-white/90">
            <div className="text-white t4">{title}</div>
            <div className="mt-1 ct4">{artist}</div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto flex w-full justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-10 rounded-full bg-[#6F8EFF] px-10 py-4 shadow-lg">
            <button
              type="button"
              onClick={onSave}
              className="flex flex-col items-center text-white"
            >
              <img src={addIcon} alt="저장" className="h-6 w-6" />
              <span className="mt-1 text-sm">이미지 저장</span>
            </button>
            <button
              type="button"
              onClick={onShare}
              className="flex flex-col items-center text-white"
            >
              <img src={shareIcon} alt="공유" className="h-6 w-6" />
              <span className="mt-1 text-sm">SNS 공유</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
