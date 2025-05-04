import filterIcon from '@/assets/icons/filter.svg';
import sortIcon from '@/assets/icons/sort.svg';
import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import HeaderWithScrollEffect from '@/components/gallery/HeaderWithScrollEffect';

const dummyData = [
  {
    id: 1,
    title: '제 13회 서울 미디어시티비엔날레',
    count: 6,
    img: '/img1.jpg',
  },
  {
    id: 2,
    title: '이불 작가의 대규모 서베이 전시',
    count: 16,
    img: '/img2.jpg',
  },
  {
    id: 3,
    title: '제 13회 서울 미디어시티비엔날레',
    count: 2,
    img: '/img3.jpg',
  },
  {
    id: 4,
    title: '제 13회 서울 미디어시티비엔날레',
    count: 8,
    img: '/img4.jpg',
  },
  {
    id: 5,
    title: '제 13회 서울 미디어시티비엔날레',
    count: 6,
    img: '/img5.jpg',
  },
  {
    id: 6,
    title: '제 13회 서울 미디어시티비엔날레',
    count: 9,
    img: '/img6.jpg',
  },
];

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

      <div className="grid grid-cols-2 gap-2 px-4 pb-32">
        {dummyData.map(item => (
          <ExhibitionCard
            key={item.id}
            title={item.title}
            count={item.count}
            img={item.img}
          />
        ))}
      </div>
    </div>
  );
}
