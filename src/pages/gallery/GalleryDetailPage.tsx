import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import { useParams } from 'react-router-dom';

import ExhibitionCard from '@/components/gallery/ExhibitionCard';
import ExhibitionInfoCard from '@/components/gallery/ExhibitionInfoCard';
import GalleryCardDetail from '@/components/gallery/GalleryCardDetail';
import { useToast } from '@/contexts/ToastContext';
import Header from '@/layouts/Header';
import useAddBookmark from '@/services/mutations/useAddBookmark';
import useRemoveBookmark from '@/services/mutations/useRemoveBookmark';
import useExhibitionVisitDetail from '@/services/queries/useExhibitionVisitDetail';
import cn from '@/utils/cn';
import s3ToHttp from '@/utils/url';

/* ---------------- util helpers (동일) ---------------- */

type Rec = Record<string, unknown>;

function asRecord(v: unknown): Rec | undefined {
  if (v && typeof v === 'object') return v as Rec;
  return undefined;
}

function pickBool(rec: Rec | undefined, keys: readonly string[]) {
  return keys
    .map(k => rec?.[k])
    .find((v): v is boolean => typeof v === 'boolean');
}

type SegmenterCtor = new (
  locale?: string,
  options?: { granularity?: 'grapheme' | 'word' | 'sentence' },
) => { segment(input: string): Iterable<unknown> };

function countGraphemes(s: string): number {
  if (!s) return 0;
  try {
    const { Segmenter } = Intl as unknown as { Segmenter?: SegmenterCtor };
    if (typeof Segmenter === 'function') {
      const seg = new Segmenter('ko', { granularity: 'grapheme' });
      return Array.from(seg.segment(s)).length;
    }
  } catch {
    /* ignore */
  }
  return Array.from(s).length;
}

function withExt(url: string): string {
  return /\.(jpg|jpeg|png|webp|gif|svg)(\?|#|$)/i.test(url)
    ? url
    : `${url}.jpg`;
}

function pickDisplayDate(
  visitedAt?: string,
  exhibitionDate?: string,
): Date | null {
  if (visitedAt) return new Date(visitedAt);
  const start = exhibitionDate?.split('~')[0]?.trim();
  return start ? new Date(start) : null;
}

type YMD = { year: string; month: string; day: string };

function fmtYMD(d: Date | null): YMD {
  if (!d || Number.isNaN(d.getTime())) {
    return { year: '', month: '', day: '' };
  }
  const yyyy = String(d.getFullYear());
  const mmNum = d.getMonth() + 1;
  const ddNum = d.getDate();

  const mm = mmNum.toString().padStart(2, '0');
  const dd = ddNum.toString().padStart(2, '0');

  return { year: yyyy, month: mm, day: dd };
}

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

function pickTagline(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('dance class') || t.includes('무용수업')) {
    return TAGLINES.degas;
  }
  if (t.includes('woman with a parasol') || t.includes('양산을 쓴 여인')) {
    return TAGLINES.monet;
  }
  if (
    t.includes('card sharp') ||
    t.includes('사기꾼') ||
    t.includes('ace of diamonds')
  ) {
    return TAGLINES.latour;
  }
  return '작품이 전하는 감각을 당신의 시선으로 완성하세요.';
}

function mapPaintingsToCards(
  paintings:
    | Array<{
        paintingId: number;
        image: string;
        paintingTitle: string;
        paintingAuthor: string;
      }>
    | undefined,
  location: string,
  ymd: YMD,
): CardItem[] {
  if (!paintings) return [];
  return paintings.map(p => ({
    id: p.paintingId,
    imageUrl: s3ToHttp(withExt(p.image ?? '')),
    title: p.paintingTitle ?? '',
    subTitle: p.paintingAuthor ?? '',
    location,
    year: ymd.year,
    month: ymd.month,
    day: ymd.day,
    tagline: pickTagline(p.paintingTitle ?? ''),
  }));
}

function ListSection({
  infoNode,
  visibleCards,
  sortedCardsLength,
  loadMoreRef,
  onCardClick,
}: {
  infoNode: React.ReactNode;
  visibleCards: CardItem[];
  sortedCardsLength: number;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  onCardClick: (id: number) => void;
}) {
  return (
    <>
      <div className="px-[2.4rem]">{infoNode}</div>

      <div
        className={cn(
          visibleCards.length === 0 ? 'grid grid-cols-1' : 'grid grid-cols-2',
          'gap-[1.2rem] px-[2.4rem]',
        )}
      >
        {visibleCards.map(art => (
          <ExhibitionCard
            key={art.id}
            imageUrl={art.imageUrl}
            title={art.title}
            subTitle={art.subTitle}
            showArrow
            onClick={() => onCardClick(art.id)}
            isSelected={false}
          />
        ))}

        <div
          ref={loadMoreRef}
          className="col-span-2 flex w-full items-center justify-center py-[2rem]"
          aria-hidden="true"
        >
          {visibleCards.length < sortedCardsLength && (
            <div className="text-gray-50 ct4" />
          )}
        </div>
      </div>
    </>
  );
}

function DetailSection({ card }: { card: CardItem | null }) {
  if (!card) {
    return (
      <div className="px-[2.4rem] pt-[4rem] text-gray-50 ct4">
        이 작품 정보를 불러오지 못했어요.
      </div>
    );
  }

  return (
    <div className="w-full px-[2.4rem] pt-[4rem]">
      <GalleryCardDetail
        data={{
          paintingId: card.id,
          imageUrl: card.imageUrl,
          title: card.title,
          subTitle: card.subTitle,
          location: card.location,
          year: card.year,
          month: card.month,
          day: card.day,
          tagline: card.tagline,
        }}
      />
    </div>
  );
}

/* ---------------- 메인 페이지 ---------------- */

export default function GalleryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const exhibitionId = Number(id);

  const { showToast } = useToast();

  const { data: detail, isFetching: loading } = useExhibitionVisitDetail(
    exhibitionId,
    Number.isFinite(exhibitionId),
  );

  const rec = useMemo(() => asRecord(detail), [detail]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [bookmarked, setBookmarked] = useState(false);

  const [visibleCount, setVisibleCount] = useState<number>(8);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedIndex(null);
    setVisibleCount(20);
  }, [exhibitionId]);

  useEffect(() => {
    const b = pickBool(rec, ['bookmark', 'bookmarked', 'isBookmarked']);
    if (typeof b === 'boolean') {
      setBookmarked(b);
    }
  }, [rec]);

  const addBookmark = useAddBookmark(exhibitionId);
  const removeBookmark = useRemoveBookmark(exhibitionId);
  const bookmarking = addBookmark.isPending || removeBookmark.isPending;

  const handleBookmarkToggle = useCallback(() => {
    if (!Number.isFinite(exhibitionId) || bookmarking) return;

    if (bookmarked) {
      setBookmarked(false);
      removeBookmark.mutate(undefined, {
        onSuccess() {
          showToast('즐겨찾기를 해제했어요.', 'success');
        },
        onError() {
          setBookmarked(true);
          showToast('즐겨찾기 해제에 실패했어요.', 'error');
        },
      });
    } else {
      setBookmarked(true);
      addBookmark.mutate(undefined, {
        onSuccess() {
          showToast('즐겨찾기에 추가했어요.', 'success');
        },
        onError() {
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
  }, [loading, info, compactTitle, bookmarked, handleBookmarkToggle]);

  const ymdBase = useMemo<YMD>(() => {
    const baseDate = pickDisplayDate(detail?.visitedAt, detail?.exhibitionDate);
    return fmtYMD(baseDate);
  }, [detail?.visitedAt, detail?.exhibitionDate]);

  const rawCards = useMemo<CardItem[]>(() => {
    return mapPaintingsToCards(
      detail?.paintings,
      detail?.gallery ?? '',
      ymdBase,
    );
  }, [detail?.paintings, detail?.gallery, ymdBase]);

  const sortedCards = useMemo<CardItem[]>(() => {
    const arr = [...rawCards];
    arr.sort((a, b) => b.id - a.id);
    return arr;
  }, [rawCards]);

  const visibleCards = useMemo<CardItem[]>(() => {
    return sortedCards.slice(0, visibleCount);
  }, [sortedCards, visibleCount]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(
    function setupObserver() {
      const handleIntersect = function handleIntersect(
        entries: IntersectionObserverEntry[],
      ): void {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setVisibleCount(function increase(prev) {
            const tentativeNext = prev + 8;
            const maxLen = sortedCards.length;
            return tentativeNext > maxLen ? maxLen : tentativeNext;
          });
        }
      };

      if (observerRef.current !== null) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (
        selectedIndex === null &&
        loadMoreRef.current !== null &&
        visibleCount < sortedCards.length
      ) {
        observerRef.current = new IntersectionObserver(handleIntersect, {
          root: null,
          rootMargin: '200px 0px 0px 0px',
          threshold: 0,
        });

        observerRef.current.observe(loadMoreRef.current);
      }

      const cleanup = function cleanup(): void {
        if (observerRef.current !== null) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      };

      return cleanup;
    },
    [selectedIndex, visibleCount, sortedCards.length],
  );

  const handleCardClick = useCallback(
    (cardId: number) => {
      const idx = sortedCards.findIndex(a => a.id === cardId);
      if (idx >= 0) {
        setSelectedIndex(idx);
      }
    },
    [sortedCards],
  );

  const currentCard = useMemo(() => {
    if (selectedIndex === null) return null;
    return sortedCards[selectedIndex] ?? null;
  }, [selectedIndex, sortedCards]);

  return (
    <div className="pb-[4rem]">
      <Header
        title="나의 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <div className="flex flex-col gap-[4rem]">
        {selectedIndex === null ? (
          <ListSection
            infoNode={infoNode}
            visibleCards={visibleCards}
            sortedCardsLength={sortedCards.length}
            loadMoreRef={loadMoreRef}
            onCardClick={handleCardClick}
          />
        ) : (
          <DetailSection card={currentCard} />
        )}
      </div>
    </div>
  );
}
