import galleryInfoIcon from '@/assets/icons/gallery-info.svg';

interface ExhibitionInfoCardProps {
  thumbnail: string;
  title: string;
  location: string;
  totalCount: number;
  lastDate: string;
  icon?: string;
}

export default function ExhibitionInfoCard({
  thumbnail,
  title,
  location,
  totalCount,
  lastDate,
  icon = galleryInfoIcon,
}: ExhibitionInfoCardProps) {
  return (
    <div className="flex flex-col gap-[1.6rem]">
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
    </div>
  );
}
