import { useMemo } from 'react';

import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Header from '@/layouts/Header';
import useScrapsByExhibition from '@/services/queries/useScrapsByExhibition';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
};

export default function MyGalleryPage() {
  const { data: scraps = [] } = useScrapsByExhibition();

  const slides: Slide[] = useMemo(
    () =>
      scraps
        .filter(
          s => typeof s.imageUrl === 'string' && s.imageUrl.trim().length > 0,
        )
        .map(s => ({
          id: s.id,
          image: s.imageUrl!.trim(),
          title: s.title?.trim() || s.artist || 'Untitled',
          subtitle: s.location || '',
        })),
    [scraps],
  );

  const duplicated = useMemo(
    () =>
      [...slides, ...slides].map((item, idx) => ({
        uid: `${item.id}-${idx < slides.length ? 'a' : 'b'}`,
        item,
      })),
    [slides],
  );

  const startIndex = slides.length;

  return (
    <main className="flex h-dvh w-full flex-col justify-start gap-[17%] overflow-hidden">
      <Header
        title="수집한 전시 작품"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <section className="relative mx-auto w-full max-w-[43rem] overflow-visible">
        {slides.length === 0 ? (
          <p className="mx-auto mt-[6rem] text-center text-gray-60 ct4">
            아직 스크랩이 없어요.
          </p>
        ) : (
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
                    <figcaption className="absolute inset-x-0 bottom-0 px-[1rem] py-[1rem] text-center text-gray-5">
                      <p className="t4">{item.title}</p>
                      {item.subtitle && (
                        <p className="opacity-80 ct4">{item.subtitle}</p>
                      )}
                    </figcaption>
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </section>
    </main>
  );
}
