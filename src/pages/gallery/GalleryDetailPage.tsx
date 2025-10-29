import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import { useParams } from 'react-router-dom';
import { Swiper as SwiperClass } from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Empty from '@/components/common/Empty';
import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import ExhibitionInfoCard from '@/components/gallery/ExhibitionInfoCard';
import GalleryCardDetail from '@/components/gallery/GalleryCardDetail';
import IndicatorDots from '@/components/gallery/IndicatorDots';
import { useToast } from '@/contexts/ToastContext';
import Header from '@/layouts/Header';
import useAddBookmark from '@/services/mutations/useAddBookmark';
import useRemoveBookmark from '@/services/mutations/useRemoveBookmark';
import useExhibitionVisitDetail from '@/services/queries/useExhibitionVisitDetail';
import cn from '@/utils/cn';
import s3ToHttp from '@/utils/url';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

type Rec = Record<string, unknown>;

const asRecord = (v: unknown): Rec | undefined =>
  v && typeof v === 'object' ? (v as Rec) : undefined;

const pickBool = (rec: Rec | undefined, keys: readonly string[]) =>
  keys.map(k => rec?.[k]).find((v): v is boolean => typeof v === 'boolean');

type SegmenterCtor = new (
  locale?: string,
  options?: { granularity?: 'grapheme' | 'word' | 'sentence' },
) => { segment(input: string): Iterable<unknown> };

const countGraphemes = (s: string): number => {
  if (!s) return 0;
  try {
    const { Segmenter } = Intl as unknown as { Segmenter?: SegmenterCtor };
    if (typeof Segmenter === 'function') {
      const seg = new Segmenter('ko', { granularity: 'grapheme' });
      return Array.from(seg.segment(s)).length;
    }
  } catch {
    /* */
  }
  return Array.from(s).length;
};

const withExt = (url: string): string =>
  /\.(jpg|jpeg|png|webp|gif|svg)(\?|#|$)/i.test(url) ? url : `${url}.jpg`;

const pickDisplayDate = (
  visitedAt?: string,
  exhibitionDate?: string,
): Date | null => {
  if (visitedAt) return new Date(visitedAt);
  const start = exhibitionDate?.split('~')[0]?.trim();
  return start ? new Date(start) : null;
};

type YMD = { year: string; month: string; day: string };

const fmtYMD = (d: Date | null): YMD => {
  if (!d || Number.isNaN(d.getTime())) return { year: '', month: '', day: '' };
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, '0'),
    day: String(d.getDate()).padStart(2, '0'),
  };
};

const TITLE_COMPACT_THRESHOLD = 42;

type CardItem = {
  id: number;
  imageUrl: string;
  title: string;
  subTitle: string;
  location: string;
  year?: string;
  month?: string;
  day?: string;
  tagline: string;
};

const TAGLINES: Record<string, string> = {
  degas: '리허설의 긴장과 호흡, 무용수의 순간을 붙잡다.',
  monet: '바람과 빛이 스쳐 지나가는 한순간의 공기.',
  latour: '명암 속에 숨은 속임수, 교차하는 시선의 심리전.',
};
const pickTagline = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('dance class') || t.includes('무용수업'))
    return TAGLINES.degas;
  if (t.includes('woman with a parasol') || t.includes('양산을 쓴 여인'))
    return TAGLINES.monet;
  if (
    t.includes('card sharp') ||
    t.includes('사기꾼') ||
    t.includes('ace of diamonds')
  )
    return TAGLINES.latour;
  return '작품이 전하는 감각을 당신의 시선으로 완성하세요.';
};

export default function GalleryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const exhibitionId = Number(id);
  const { showToast } = useToast();

  const {
    data: detail,
    isFetching: loading,
    isError,
  } = useExhibitionVisitDetail(exhibitionId, Number.isFinite(exhibitionId));

  const rec = useMemo(() => asRecord(detail), [detail]);

  const swiperRef = useRef<SwiperClass | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const b = pickBool(rec, ['bookmark', 'bookmarked', 'isBookmarked']);
    if (typeof b === 'boolean') setBookmarked(b);
  }, [rec]);

  const addBookmark = useAddBookmark(exhibitionId);
  const removeBookmark = useRemoveBookmark(exhibitionId);
  const bookmarking = addBookmark.isPending || removeBookmark.isPending;

  const handleBookmarkToggle = useCallback(() => {
    if (!Number.isFinite(exhibitionId) || bookmarking) return;
    if (bookmarked) {
      setBookmarked(false);
      removeBookmark.mutate(undefined, {
        onSuccess: () => showToast('즐겨찾기를 해제했어요.', 'success'),
        onError: () => {
          setBookmarked(true);
          showToast('즐겨찾기 해제에 실패했어요.', 'error');
        },
      });
    } else {
      setBookmarked(true);
      addBookmark.mutate(undefined, {
        onSuccess: () => showToast('즐겨찾기에 추가했어요.', 'success'),
        onError: () => {
          setBookmarked(false);
          showToast('즐겨찾기 추가에 실패했어요.', 'error');
        },
      });
    }
  }, [
    exhibitionId,
    bookmarking,
    bookmarked,
    addBookmark,
    removeBookmark,
    showToast,
  ]);

  const info = useMemo(() => {
    const thumbnail = s3ToHttp(withExt(detail?.exhibitionImage ?? ''));
    const title = detail?.exhibitionTitle ?? '';
    const location = detail?.gallery ?? '';
    const totalCount = detail?.paintings?.length ?? 0;
    const lastDate = detail?.visitedAt ?? '';
    return { thumbnail, title, location, totalCount, lastDate };
  }, [detail]);

  const compactTitle = useMemo(
    () => countGraphemes(info.title) > TITLE_COMPACT_THRESHOLD,
    [info.title],
  );

  const infoNode = useMemo(() => {
    if (loading) {
      return (
        <div className="animate-pulse h-[9.6rem] w-full rounded-[12px] bg-gray-10" />
      );
    }
    if (isError && !detail) {
      return (
        <div className="rounded-[12px] bg-red-50 p-[1.2rem] text-red-500 ct4">
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
        onBookmarkToggle={handleBookmarkToggle}
        compactTitle={compactTitle}
      />
    );
  }, [
    loading,
    isError,
    detail,
    info,
    compactTitle,
    bookmarked,
    handleBookmarkToggle,
  ]);

  const cards: CardItem[] = useMemo(() => {
    const list = detail?.paintings ?? [];
    const base = fmtYMD(
      pickDisplayDate(detail?.visitedAt, detail?.exhibitionDate),
    );
    const location = detail?.gallery ?? '';
    return list.map(p => ({
      id: p.paintingId,
      imageUrl: s3ToHttp(withExt(p.image)),
      title: p.paintingTitle,
      subTitle: p.paintingAuthor,
      location,
      year: base.year,
      month: base.month,
      day: base.day,
      tagline: pickTagline(p.paintingTitle),
    }));
  }, [
    detail?.paintings,
    detail?.gallery,
    detail?.visitedAt,
    detail?.exhibitionDate,
  ]);

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
            <div
              className={cn(
                cards.length === 0 ? 'grid grid-cols-1' : 'grid grid-cols-2',
                'gap-[1.2rem] px-[2.4rem]',
              )}
            >
              {cards.length === 0 ? (
                <div className="py-[5rem]">
                  <Empty title="등록된 작품이 없어요." />
                </div>
              ) : (
                cards.map(art => (
                  <ExhibitionCard
                    key={art.id}
                    imageUrl={art.imageUrl}
                    title={art.title}
                    subTitle={art.subTitle}
                    showArrow
                    onClick={() =>
                      setSelectedIndex(cards.findIndex(a => a.id === art.id))
                    }
                    isSelected={false}
                  />
                ))
              )}
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
                initialSlide={selectedIndex ?? 0}
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
                {cards.map(art => (
                  <SwiperSlide
                    key={art.id}
                    className="flex w-[36rem] justify-center"
                  >
                    <GalleryCardDetail
                      data={{
                        imageUrl: art.imageUrl,
                        title: art.title,
                        subTitle: art.subTitle,
                        location: art.location,
                        year: art.year,
                        month: art.month,
                        day: art.day,
                        tagline: art.tagline,
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="z-10 mt-[-2rem] flex justify-center">
              <IndicatorDots
                count={cards.length}
                activeIndex={selectedIndex ?? 0}
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
