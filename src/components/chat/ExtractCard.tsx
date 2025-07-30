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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative mx-auto h-[812px] w-full max-w-[425px] overflow-hidden bg-neutral-900">
        {/* 바텀 핸들러 */}
        <div className="absolute bottom-0 flex h-8 w-full justify-center">
          <div className="mt-[19.5px] h-[4.81px] w-32 rounded-full bg-black" />
        </div>

        <div className="absolute left-4 top-10">
          <BackButton className="text-white" />
        </div>

        {/* 반투명 카드 이미지 */}
        <div className="absolute left-1/2 top-[133px] h-[519px] w-80 -translate-x-1/2 overflow-hidden rounded-2xl bg-black/50">
          <img
            src={imageUrl}
            alt="artwork"
            className="h-full w-full rounded-2xl object-cover opacity-30"
          />
        </div>

        {/* 인용 텍스트 */}
        <div className="absolute left-1/2 top-[338px] w-60 -translate-x-1/2 text-center text-lg leading-relaxed text-white">
          {quote}
        </div>

        {/* 제목 및 작가 */}
        <div className="absolute left-1/2 top-[568px] flex -translate-x-1/2 flex-col items-center gap-4">
          <div className="h-px w-72 bg-white/20" />
          <div className="flex flex-col items-center gap-0.5 text-white/80">
            <div className="text-lg font-medium">{title}</div>
            <div className="text-sm font-normal">{artist}</div>
          </div>
        </div>

        {/* 로고 텍스트 */}
        <div className="absolute left-16 top-[149px] text-xs font-medium text-black">
          LOGO
        </div>

        {/* 하단 버튼 */}
        <div className="absolute top-[680px] flex w-full justify-center">
          <div className="inline-flex gap-7 rounded-full bg-[#8F2E39]/90 px-7 py-3">
            <button
              type="button"
              onClick={onSave}
              className="flex flex-col items-center"
            >
              <img src={addIcon} alt="저장" />
              <div className="mt-1 text-sm text-white">이미지 저장</div>
            </button>
            <button
              type="button"
              onClick={onShare}
              className="flex flex-col items-center"
            >
              <img src={shareIcon} alt="공유" />
              <div className="mt-1 text-sm text-white">SNS 공유</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
