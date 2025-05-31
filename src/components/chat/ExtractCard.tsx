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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative w-full max-w-[425px] h-[812px] bg-neutral-900 overflow-hidden mx-auto">
        {/* 바텀 핸들러 */}
        <div className="w-full h-8 absolute bottom-0 flex justify-center">
          <div className="w-32 h-[4.81px] bg-black rounded-full mt-[19.5px]" />
        </div>

        <div className="absolute top-10 left-4">
          <BackButton className="text-white" />
        </div>

        {/* 반투명 카드 이미지 */}
        <div className="absolute top-[133px] left-1/2 -translate-x-1/2 w-80 h-[519px] rounded-2xl bg-black/50 overflow-hidden">
          <img
            src={imageUrl}
            alt="artwork"
            className="w-full h-full object-cover opacity-30 rounded-2xl"
          />
        </div>

        {/* 인용 텍스트 */}
        <div className="absolute top-[338px] left-1/2 -translate-x-1/2 w-60 text-white text-lg leading-relaxed text-center">
          {quote}
        </div>

        {/* 제목 및 작가 */}
        <div className="absolute top-[568px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-72 h-px bg-white/20" />
          <div className="flex flex-col items-center gap-0.5 text-white/80">
            <div className="text-lg font-medium">{title}</div>
            <div className="text-sm font-normal">{artist}</div>
          </div>
        </div>

        {/* 로고 텍스트 */}
        <div className="absolute top-[149px] left-16 text-black text-xs font-medium">
          LOGO
        </div>

        {/* 하단 버튼 */}
        <div className="absolute top-[680px] w-full flex justify-center">
          <div className="px-7 py-3 bg-[#8F2E39]/90 rounded-full inline-flex gap-7">
            <button
              type="button"
              onClick={onSave}
              className="flex flex-col items-center"
            >
              <img src={addIcon} alt="저장" />
              <div className="text-white text-sm mt-1">이미지 저장</div>
            </button>
            <button
              type="button"
              onClick={onShare}
              className="flex flex-col items-center"
            >
              <img src={shareIcon} alt="공유" />
              <div className="text-white text-sm mt-1">SNS 공유</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
