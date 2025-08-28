import { useState } from 'react';

import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import PopularInfoCard from '@/components/main/PopularInfoCard';
import Header from '@/layouts/Header';
import { artworks, exhibitionInfo } from '@/mock/galleryDetailData';

export default function PopularDetailPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="pb-[4rem]">
      <Header
        title="인기 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <div className="flex flex-col gap-[4rem]">
        {selectedIndex === null && (
          <>
            <div className="px-[2.4rem]">
              <PopularInfoCard
                thumbnail={exhibitionInfo.thumbnail}
                title={exhibitionInfo.title}
                location={exhibitionInfo.location}
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
                  isSelected={false}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
