import { useEffect, useMemo, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';
import { Swiper as SwiperClass } from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import ExhibitionInfoCard from '@/components/gallery/ExhibitionInfoCard';
import GalleryCardDetail from '@/components/gallery/GalleryCardDetail';
import IndicatorDots from '@/components/gallery/IndicatorDots';
import Header from '@/layouts/Header';
import { artworks, exhibitionInfo } from '@/mock/galleryDetailData';
import useExhibitionVisitDetail from '@/services/queries/useExhibitionVisitDetail';
import s3ToHttp from '@/utils/url';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const asRecord = (v: unknown): Record<string, unknown> | undefined =>
  v && typeof v === 'object' ? (v as Record<string, unknown>) : undefined;

const pickStr = (
  rec: Record<string, unknown> | undefined,
  keys: readonly string[],
) => keys.map(k => rec?.[k]).find((v): v is string => typeof v === 'string');

const pickNum = (
  rec: Record<string, unknown> | undefined,
  keys: readonly string[],
) => keys.map(k => rec?.[k]).find((v): v is number => typeof v === 'number');

const pickBool = (
  rec: Record<string, unknown> | undefined,
  keys: readonly string[],
) => keys.map(k => rec?.[k]).find((v): v is boolean => typeof v === 'boolean');

export default function GalleryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const exhibitionId = Number(id);

  const {
    data: detail,
    isFetching: loading,
    isError,
  } = useExhibitionVisitDetail(exhibitionId, Number.isFinite(exhibitionId));

  const rec = useMemo(() => asRecord(detail), [detail]);

  const swiperRef = useRef<SwiperClass>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [bookmarked, setBookmarked] = useState(false);
  useEffect(() => {
    setBookmarked(Boolean(pickBool(rec, ['isBookmarked', 'bookmarked'])));
  }, [rec]);

  const info = useMemo(() => {
    if (rec) {
      const thumbnail = s3ToHttp(
        pickStr(rec, ['exhibitionImage', 'thumbnail', 'coverImage', 'image']) ??
          '',
      );
      const title = pickStr(rec, ['exhibitionTitle', 'title']) ?? '';
      const location = pickStr(rec, ['gallery', 'location', 'museum']) ?? '';
      const totalCount =
        pickNum(rec, [
          'artCount',
          'totalCount',
          'paintingCount',
          'worksCount',
        ]) ?? artworks.length;
      const lastDate =
        pickStr(rec, [
          'lastDate',
          'visitedAt',
          'startAt',
          'createdAt',
          'updatedAt',
          'date',
        ]) ?? '';

      return { thumbnail, title, location, totalCount, lastDate };
    }

    return {
      thumbnail: exhibitionInfo.thumbnail,
      title: exhibitionInfo.title,
      location: exhibitionInfo.location,
      totalCount: exhibitionInfo.totalCount,
      lastDate: exhibitionInfo.lastDate,
    };
  }, [rec]);

  const infoNode = useMemo(() => {
    if (loading) {
      return (
        <div className="animate-pulse h-[9.6rem] w-full rounded-[12px] bg-gray-10" />
      );
    }
    if (isError && !detail) {
      return (
        <div className="rounded-[12px] bg-red-50 p-[1.2rem] text-ct4 text-red-500">
          전시 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </div>
      );
    }
    return (
      <ExhibitionInfoCard
        thumbnail={info.thumbnail}
        title={info.title}
        location={info.location}
        totalCount={info.totalCount}
        lastDate={info.lastDate}
        isBookmarked={bookmarked}
        onBookmarkToggle={() => setBookmarked(prev => !prev)}
      />
    );
  }, [loading, isError, detail, info, bookmarked]);

  return (
    <div className="pb-[4rem]">
      <Header
        title="나의 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <div className="flex flex-col gap-[4rem]">
        {selectedIndex === null ? (
          <>
            <div className="px-[2.4rem]">{infoNode}</div>

            <div className="grid grid-cols-2 gap-[1.2rem] px-[2.4rem]">
              {artworks.map((art, idx) => (
                <ExhibitionCard
                  key={art.id}
                  imageUrl={art.imageUrl}
                  title={art.title}
                  subTitle={art.subTitle}
                  showArrow={art.showArrow}
                  onClick={() => setSelectedIndex(idx)}
                  isSelected={false}
                />
              ))}
            </div>
          </>
        ) : (
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
