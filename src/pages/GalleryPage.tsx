import filterIcon from '@/assets/icons/filter.svg';
import sortIcon from '@/assets/icons/sort.svg';
import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import HeaderWithScrollEffect from '@/components/gallery/HeaderWithScrollEffect';
import exhibitionData from '@/mock/galleryData';
import type { ExhibitionItem } from '@/types';

export default function GalleryPage() {
  return (
    <div className="pt-[68px]">
      <HeaderWithScrollEffect />
      <div className="px-4 py-3 flex justify-between items-center top-[68px] z-10 bg-white">
        <div className="flex gap-2">
          <button
            type="button"
            className="px-3 py-1.5 text-sm bg-neutral-100 text-zinc-800 rounded-full"
          >
            즐겨찾기만
          </button>
          <button
            type="button"
            className="px-3 py-1.5 bg-neutral-100 rounded-full"
          >
            <img src={filterIcon} alt="필터" />
          </button>
        </div>
        <div className="flex items-center gap-1 text-xs text-neutral-800 font-medium">
          최신순 <img src={sortIcon} alt="정렬" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        {exhibitionData.map((item: ExhibitionItem) => (
          <ExhibitionCard
            key={item.id}
            id={item.id}
            title={item.title}
            count={item.count}
            img={item.img}
          />
        ))}
      </div>
    </div>
  );
}
