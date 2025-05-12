import sortIcon from '@/assets/icons/sort.svg';
import art1 from '@/assets/images/sample/detail-art-1.png';
import art2 from '@/assets/images/sample/detail-art-2.png';
import art3 from '@/assets/images/sample/detail-art-3.png';
import art4 from '@/assets/images/sample/detail-art-4.png';
import art5 from '@/assets/images/sample/detail-art-5.png';
import coverImg from '@/assets/images/sample/gallery-cover.png';
import HeaderWithBack from '@/components/common/HeaderWithBack';
import ArtworkImageGrid from '@/components/gallery-detail/ArtworkImageGrid';
import GalleryInfoHeader from '@/components/gallery-detail/GalleryInfoHeader';

export default function GalleryDetailPage() {
  const artworkImages = [
    { id: 'art-1', src: art1 },
    { id: 'art-2', src: art2 },
    { id: 'art-3', src: art3 },
    { id: 'art-4', src: art4 },
    { id: 'art-5', src: art5 },
  ];
  return (
    <div className="relative bg-white min-h-screen">
      <div className="relative w-full h-[485px]">
        <img
          src={coverImg}
          alt="전시 커버"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-neutral-200/0 via-neutral-200/70 to-neutral-200 pointer-events-none" />

      <HeaderWithBack />
      <GalleryInfoHeader
        title={'이불 작가의\n대규모 서베이 전시'}
        location="리움미술관 아동교육문화센터"
        date="2025.09.04. – 2026.01.04."
      />

      <div className="absolute left-[18px] top-[315px] w-[90%] flex justify-between items-end">
        <span className="text-sm font-medium text-neutral-800">
          작품
          {artworkImages.length}개
        </span>
        <span className="text-xs font-medium text-neutral-800 flex items-center gap-1">
          최신순
          <img src={sortIcon} alt="정렬" />
        </span>
      </div>

      <ArtworkImageGrid images={artworkImages} />
    </div>
  );
}
