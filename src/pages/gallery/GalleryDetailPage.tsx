import { useRef, useState } from 'react';

import { Swiper as SwiperClass } from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import ExhibitionInfoCard from '@/components/gallery/ExhibitionInfoCard';
import GalleryCardDetail from '@/components/gallery/GalleryCardDetail';
import IndicatorDots from '@/components/gallery/IndicatorDots';
import Header from '@/layouts/Header';
import { artworks, exhibitionInfo } from '@/mock/galleryDetailData';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

export default function GalleryDetailPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const swiperRef = useRef<SwiperClass>();

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
                  isSelected={false}
                />
              ))}
            </div>
          </>
        )}

        {selectedIndex !== null && (
          <>
            <div className="w-full px-[2.4rem] pt-[4rem]">
              <Swiper
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView="auto"
                onSlideChange={swiper => setSelectedIndex(swiper.realIndex)}
                initialSlide={selectedIndex}
                onSwiper={swiper => {
                  swiperRef.current = swiper;
                }}
                coverflowEffect={{
                  rotate: 45,
                  stretch: 0,
                  depth: 150,
                  modifier: 1,
                  slideShadows: false,
                }}
                modules={[EffectCoverflow]}
              >
                {artworks.map(art => (
                  <SwiperSlide
                    key={art.id}
                    className="flex w-[36rem] justify-center"
                  >
                    <GalleryCardDetail data={art} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="z-10 mt-[-2rem] flex justify-center">
              <IndicatorDots
                count={artworks.length}
                activeIndex={selectedIndex}
                onDotClick={index => {
                  setSelectedIndex(index);
                  swiperRef.current?.slideTo(index);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
