import CalendarBox from '@/components/gallery/CalendarBox';
import IndicatorDots from '@/components/gallery/IndicatorDots';

interface Props {
  data: {
    imageUrl: string;
    title: string;
    subTitle: string;
    date?: string;
    month?: string;
  };
  onBack: () => void;
}

export default function GalleryCardDetail({ data, onBack }: Props) {
  return (
    <div className="flex w-full max-w-[36rem] flex-col items-center gap-[5.6rem] px-[2.4rem]">
      <div className="relative w-full">
        <img
          className="h-[48.1rem] w-full rounded-2xl object-cover"
          src={data.imageUrl}
          alt={data.title}
        />

        <div className="absolute left-[2.5rem] top-[2.3rem]">
          <CalendarBox month={data.month} date={data.date} />
        </div>

        <div className="absolute bottom-0 left-0 w-full rounded-b-2xl bg-gradient-to-b from-sky-800/0 to-blue-500 px-[2.4rem] py-[2.4rem]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-[0.2rem]">
              <p className="text-xs font-semibold text-white">
                {data.subTitle}
              </p>
              <p className="text-3xl font-bold text-white">{data.title}</p>
            </div>
            <button
              aria-label="뒤로가기"
              type="button"
              className="flex h-6 w-6 rotate-180 items-center justify-center"
              onClick={onBack}
            >
              <div className="h-4 w-4 outline outline-2 outline-offset-[-1px] outline-white" />
            </button>
          </div>
        </div>
      </div>

      <IndicatorDots />
    </div>
  );
}
