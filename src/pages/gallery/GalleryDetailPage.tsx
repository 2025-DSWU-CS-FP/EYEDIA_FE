import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import ExhibitionInfoCard from '@/components/gallery/ExhibitionInfoCard';
import Header from '@/layouts/Header';
import { artworks, exhibitionInfo } from '@/mock/galleryDetailData';

export default function GalleryDetailPage() {
  return (
    <div className="pb-[4rem]">
      <Header title="나의 전시" showBackButton />
      <div className="mt-[2rem] px-[2.4rem]">
        <ExhibitionInfoCard
          thumbnail={exhibitionInfo.thumbnail}
          title={exhibitionInfo.title}
          location={exhibitionInfo.location}
          totalCount={exhibitionInfo.totalCount}
          lastDate={exhibitionInfo.lastDate}
        />
      </div>

      <div className="mt-[2.4rem] grid grid-cols-2 gap-[1.2rem] px-[2.4rem]">
        {artworks.map(art => (
          <ExhibitionCard
            key={art.id}
            imageUrl={art.imageUrl}
            title={art.title}
            showArrow={art.showArrow}
          />
        ))}
      </div>
    </div>
  );
}
