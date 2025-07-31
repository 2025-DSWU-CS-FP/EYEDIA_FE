import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import ExhibitionInfoCard from '@/components/gallery/ExhibitionInfoCard';
import Header from '@/layouts/Header';
import { artworks, exhibitionInfo } from '@/mock/galleryDetailData';

export default function GalleryDetailPage() {
  return (
    <div className="pb-[4rem]">
      <Header
        title="나의 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />
      <div className="flex flex-col gap-[4rem]">
        <div className="px-[2.4rem]">
          <ExhibitionInfoCard
            thumbnail={exhibitionInfo.thumbnail}
            title={exhibitionInfo.title}
            location={exhibitionInfo.location}
            totalCount={exhibitionInfo.totalCount}
            lastDate={exhibitionInfo.lastDate}
          />
        </div>

        <div className="grid grid-cols-2 gap-[1.2rem] px-[2.4rem]">
          {artworks.map(art => (
            <ExhibitionCard
              key={art.id}
              imageUrl={art.imageUrl}
              title={art.title}
              subTitle={art.subTitle}
              showArrow={art.showArrow}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
