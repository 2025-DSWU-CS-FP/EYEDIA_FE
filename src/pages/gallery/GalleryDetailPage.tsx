import { useState } from 'react';

import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import ExhibitionInfoCard from '@/components/gallery/ExhibitionInfoCard';
import GalleryCardDetail from '@/components/gallery/GalleryCardDetail';
import Header from '@/layouts/Header';
import { artworks, exhibitionInfo } from '@/mock/galleryDetailData';

interface Artwork {
  id: string;
  imageUrl: string;
  title: string;
  subTitle: string;
  showArrow: boolean;
}

export default function GalleryDetailPage() {
  const [selectedCard, setSelectedCard] = useState<Artwork | null>(null);

  return (
    <div className="pb-[4rem]">
      <Header
        title="나의 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <div className="flex flex-col gap-[4rem]">
        {!selectedCard && (
          <div className="px-[2.4rem]">
            <ExhibitionInfoCard
              thumbnail={exhibitionInfo.thumbnail}
              title={exhibitionInfo.title}
              location={exhibitionInfo.location}
              totalCount={exhibitionInfo.totalCount}
              lastDate={exhibitionInfo.lastDate}
            />
          </div>
        )}

        {selectedCard ? (
          <div className="flex justify-center px-[2.4rem] pt-[4rem]">
            <GalleryCardDetail
              data={selectedCard}
              onBack={() => setSelectedCard(null)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-[1.2rem] px-[2.4rem]">
            {artworks.map(art => (
              <ExhibitionCard
                key={art.id}
                imageUrl={art.imageUrl}
                title={art.title}
                subTitle={art.subTitle}
                showArrow={art.showArrow}
                onClick={() => setSelectedCard(art)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
