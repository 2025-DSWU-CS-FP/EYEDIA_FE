import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import artImg1 from '@/assets/images/sample/gallery-detail1.png';
import artImg2 from '@/assets/images/sample/gallery-detail2.png';
import artImg3 from '@/assets/images/sample/gallery-detail3.png';
import artImg4 from '@/assets/images/sample/gallery-detail4.png';
import Header from '@/layouts/Header';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const galleryItems = [
  { id: 1, image: artImg1, title: 'Artwork 1' },
  { id: 2, image: artImg2, title: 'Artwork 2' },
  { id: 3, image: artImg3, title: 'Artwork 3' },
  { id: 4, image: artImg4, title: 'Artwork 4' },
];

export default function MyGalleryPage() {
  return (
    <div className="flex w-full flex-col">
      <Header
        title="수집한 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <div className="relative flex flex-col items-center justify-center bg-gradient-to-b py-[4rem]">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop
          coverflowEffect={{
            rotate: 45,
            stretch: 0,
            depth: 150,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[EffectCoverflow]}
          className="relative z-10 w-full"
        >
          {galleryItems.map(item => (
            <SwiperSlide
              key={item.id}
              className="w-[24rem] p-[4rem] opacity-90 transition-opacity hover:opacity-100"
            >
              <div className="flex flex-col items-center overflow-hidden rounded-[8px] bg-white/60 shadow-lg backdrop-blur-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[32rem] w-full object-cover"
                />
                <p className="py-[1rem] text-center text-[1.4rem] font-medium text-gray-90">
                  {item.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
