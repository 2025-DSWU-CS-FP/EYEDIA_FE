import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import artImg1 from '@/assets/images/sample/gallery-detail1.png';
import artImg2 from '@/assets/images/sample/gallery-detail2.png';
import artImg3 from '@/assets/images/sample/gallery-detail3.png';
import artImg4 from '@/assets/images/sample/gallery-detail4.png';
import Header from '@/layouts/Header';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

interface GalleryItem {
  id: number;
  image: string;
  title: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, image: artImg1, title: 'Artwork 1' },
  { id: 2, image: artImg2, title: 'Artwork 2' },
  { id: 3, image: artImg3, title: 'Artwork 3' },
  { id: 4, image: artImg4, title: 'Artwork 4' },
];

const duplicated = [...galleryItems, ...galleryItems].map((item, idx) => ({
  uid: `${item.id}-${idx < galleryItems.length ? 'a' : 'b'}`,
  item,
}));

export default function MyGalleryPage() {
  const startIndex = galleryItems.length;

  return (
    <main className="flex h-dvh w-full flex-col justify-start gap-[17%] overflow-hidden">
      <Header
        title="수집한 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <section className="relative mx-auto w-full max-w-[43rem] overflow-visible">
        <div dir="rtl">
          <Swiper
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            loop={false}
            initialSlide={startIndex}
            spaceBetween={12}
            watchSlidesProgress
            coverflowEffect={{
              rotate: 45,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: false,
            }}
            modules={[EffectCoverflow]}
            className="relative z-10 w-full !overflow-visible px-[3rem]"
          >
            {duplicated.map(({ uid, item }) => (
              <SwiperSlide key={uid} className="!w-[22rem]">
                <figure
                  className="relative w-full overflow-hidden rounded-[8px] shadow-lg backdrop-blur-md"
                  dir="ltr"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[30rem] w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[10rem] bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 px-[1rem] py-[1rem] text-center text-gray-5 ct4">
                    {item.title}
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </main>
  );
}
