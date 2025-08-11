import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5';

import galleryInfoIcon from '@/assets/icons/gallery-info.svg';

interface ExhibitionInfoCardProps {
  thumbnail: string;
  title: string;
  location: string;
  totalCount: number;
  lastDate: string;
  icon?: string;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  pending?: boolean;
}

export default function ExhibitionInfoCard({
  thumbnail,
  title,
  location,
  totalCount,
  lastDate,
  isBookmarked,
  onBookmarkToggle,
  pending = false,
  icon = galleryInfoIcon,
}: ExhibitionInfoCardProps) {
  return (
    <section className="flex flex-col gap-[1.6rem]">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-[1.6rem]">
          <img
            src={thumbnail}
            alt="전시 썸네일"
            className="h-[7.2rem] w-[7.2rem] rounded-[8px] object-cover"
          />
          <div className="flex flex-col gap-[0.4rem]">
            <h2 className="text-t3 font-semibold text-gray-90">{title}</h2>
            <p className="text-ct3 text-gray-50">{location}</p>
          </div>
        </div>

        <button
          type="button"
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
          onClick={onBookmarkToggle}
          disabled={pending}
          className="shrink-0 rounded-[8px] p-[0.8rem] hover:bg-gray-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-mint disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBookmarked ? (
            <IoBookmark className="h-[2.5rem] w-[2.5rem] text-brand-mint" />
          ) : (
            <IoBookmarkOutline className="h-[2.5rem] w-[2.5rem] text-gray-70 [&>path]:[stroke-width:40]" />
          )}
        </button>
      </header>

      <div className="relative w-full">
        <div className="absolute -top-[0.6rem] left-[2rem] z-[1] h-0 w-0 border-x-[0.6rem] border-b-[0.6rem] border-x-transparent border-b-white" />
        <div className="relative z-[0] w-full rounded-[8px] bg-white px-[2rem] py-[1.6rem] shadow-sm">
          <p className="text-ct2 text-gray-80">
            <span>총 </span>
            <span className="font-bold text-[#3DAF9C]">{totalCount}</span>
            개의 작품을 수집하고,
            <br />
            <span className="font-bold text-[#769DFF]">{lastDate}</span>에
            마지막으로 감상했어요.
          </p>
          <div className="absolute right-[1.2rem] top-1/2 h-[3.6rem] w-[3.6rem] -translate-y-1/2 overflow-hidden rounded-[6px]">
            <img
              src={icon}
              alt="아이콘"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
