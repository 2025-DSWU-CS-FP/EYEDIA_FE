import { useMemo } from 'react';

import { useParams, Link } from 'react-router-dom';

import Ticket from '@/assets/images/ticket.png';
import PopularInfoCard from '@/components/main/PopularInfoCard';
import Header from '@/layouts/Header';
import usePopularExhibitionDetail from '@/services/queries/usePopularExhibitionDetail';
import s3ToHttp from '@/utils/url';

export default function PopularDetailPage() {
  const { id } = useParams<{ id: string }>();

  const exhibitionId = useMemo(() => {
    const n = Number(id);
    return Number.isNaN(n) ? undefined : n;
  }, [id]);

  const {
    data: detail,
    isFetching: loading,
    isError,
  } = usePopularExhibitionDetail(exhibitionId, !!exhibitionId);

  const ui = useMemo(() => {
    if (!detail) return null;
    return {
      title: detail.exhibitionTitle,
      location: detail.gallery ?? '',
      thumbnail: s3ToHttp(detail.exhibitionImage ?? ''),
    };
  }, [detail]);

  const showSkeleton = loading;
  const showError = !loading && (isError || !ui);
  const showContent = !loading && !isError && !!ui;

  const infoNode = useMemo(() => {
    if (showSkeleton) {
      return (
        <div className="animate-pulse h-[9.6rem] w-full rounded-[12px] bg-gray-10" />
      );
    }
    if (showError) {
      return (
        <p className="text-ct4 text-red-500" role="alert">
          전시 정보를 불러오지 못했어요.
        </p>
      );
    }
    if (showContent && ui) {
      return (
        <PopularInfoCard
          thumbnail={ui.thumbnail}
          title={ui.title}
          location={ui.location}
        />
      );
    }
    return null;
  }, [showSkeleton, showError, showContent, ui]);

  const imageNode = useMemo(() => {
    if (showSkeleton) {
      return (
        <div className="px-[2.4rem]">
          <div className="animate-pulse h-[20rem] w-full rounded-[12px] bg-gray-10" />
        </div>
      );
    }
    if (showContent && ui) {
      return (
        <img
          alt="인기 전시 상세 이미지"
          src={ui.thumbnail}
          className="px-[2.4rem]"
          loading="lazy"
        />
      );
    }
    return null;
  }, [showSkeleton, showContent, ui]);

  return (
    <div className="pb-[4rem]">
      <Header
        title="인기 전시"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <main className="flex flex-col gap-[4rem]">
        <section className="px-[2.4rem]">{infoNode}</section>

        <section aria-live="polite">{imageNode}</section>

        <section className="px-[2rem]">
          <Link
            to="/card"
            className="gradient-rotate gradient-dramatic shine relative mx-[0rem] flex h-[9.6rem] items-center justify-between gap-[1.3rem] rounded-[10px] bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 px-[2.4rem]"
            aria-label="Eyedia 공유하기"
          >
            <div className="flex flex-col justify-start gap-[0.4rem] text-left">
              <p className="whitespace-nowrap text-gray-800 bt3">
                친구와 함께 전시를 관람하고 싶다면?
              </p>
              <p className="text-black t3">Eyedia 공유하기 →</p>
            </div>
            <img className="max-w-[8rem]" src={Ticket} alt="티켓이미지" />
          </Link>
        </section>
      </main>
    </div>
  );
}
