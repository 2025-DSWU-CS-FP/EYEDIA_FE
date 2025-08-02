import { useState } from 'react';

import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import ExhibitionInfoCard from '@/components/gallery/ExhibitionInfoCard';
import GalleryCardDetail from '@/components/gallery/GalleryCardDetail';
import Header from '@/layouts/Header';
import { artworks, exhibitionInfo } from '@/mock/galleryDetailData';

export default function GalleryDetailPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="pb-[4rem]">
      <Header
        title="나의 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <div className="flex flex-col gap-[4rem]">
        {selectedIndex === null && (
          <>
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
              {artworks.map((art, idx) => (
                <ExhibitionCard
                  key={art.id}
                  imageUrl={art.imageUrl}
                  title={art.title}
                  subTitle={art.subTitle}
                  showArrow={art.showArrow}
                  onClick={() => handleCardClick(idx)}
                  isSelected={selectedIndex === idx}
                />
              ))}
            </div>
          </>
        )}

        {selectedIndex !== null && (
          <div className="flex justify-center px-[2.4rem] pt-[4rem]">
            <GalleryCardDetail
              key={selectedIndex}
              data={artworks[selectedIndex]}
              currentIndex={selectedIndex}
              total={artworks.length}
              onPrev={() =>
                setSelectedIndex(prev => (prev! > 0 ? prev! - 1 : prev))
              }
              onNext={() =>
                setSelectedIndex(prev =>
                  prev! < artworks.length - 1 ? prev! + 1 : prev,
                )
              }
              onDotClick={index => {
                setSelectedIndex(index);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
