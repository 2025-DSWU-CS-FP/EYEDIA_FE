import addIcon from '@/assets/icons/add-image.svg';
import shareIcon from '@/assets/icons/share-image.svg';
import Logo from '@/assets/images/logo.svg';
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
        <div className="pt-[max(1rem,env(safe-area-inset-top))]">
          <BackButton className="text-gray-100" />
        </div>

        <div className="relative mx-auto mt-[5rem] h-[52rem] w-[90%] overflow-hidden rounded-[16px]">
          <img
            src={imageUrl}
            alt="artwork"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute left-[1.5rem] top-[1.5rem] flex items-center gap-[0.5rem]">
            <img src={Logo} alt="로고" className="h-[3rem] w-[3rem]" />
            <span className="text-t4 font-bold text-gray-0">EYEDIA</span>
          </div>

          <div className="absolute bottom-28 left-6 right-6 top-0 flex items-center">
            <p className="leading-relaxed text-white bd1">{quote}</p>
          </div>

          <div className="absolute bottom-[2.6rem] left-6 right-6 flex flex-col gap-[1.6rem] text-white/90">
            <div className="left-6 right-6 h-px bg-white/30" />
            <div className="bottom-6 left-6 right-6 text-white/90">
              <div className="text-white t4">{title}</div>
              <div className="mt-1 ct4">{artist}</div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex w-full justify-center pb-[max(3rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-[2.7rem] rounded-full bg-brand-blue px-10 py-4 shadow-lg">
            <button
              type="button"
              onClick={onSave}
              className="flex flex-col items-center text-white"
            >
              <img src={addIcon} alt="저장" className="h-[2.4rem] w-[2.4rem]" />
              <span className="mt-1 ct4">이미지 저장</span>
            </button>
            <button
              type="button"
              onClick={onShare}
              className="flex flex-col items-center text-white"
            >
              <img
                src={shareIcon}
                alt="공유"
                className="h-[2.4rem] w-[2.4rem]"
              />
              <span className="mt-1 ct4">SNS 공유</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
