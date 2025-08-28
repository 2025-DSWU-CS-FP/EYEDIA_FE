import { useEffect } from 'react';

import { Link } from 'react-router-dom';

import CookieIcon from '@/assets/icons/cookie.svg';

interface CookieModalProps {
  onClose?: () => void;
}

export default function CookieModal({ onClose }: CookieModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
      className="w-full max-w-[33rem] rounded-[12px] bg-white shadow-lg"
    >
      <div className="relative flex flex-col gap-[1.2rem] px-[2rem] pb-[2rem] pt-[3.6rem]">
        <img
          src={CookieIcon}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-[4.6rem] w-[6.5rem] -translate-x-1/2 -translate-y-1/2"
        />

        <h2 id="cookie-title" className="text-bd1 font-semibold text-gray-90">
          쿠키 사용 안내
        </h2>

        <p className="text-ct4 leading-[1.6] text-gray-70">
          EYEDIA는 서비스 기능 제공, 이용 통계 분석 및 맞춤형 콘텐츠 제공을 위해
          쿠키(필수/선택)를 사용합니다. 자세한 내용은{' '}
          <Link
            to="/privacy"
            className="font-semibold text-brand-blue underline underline-offset-2 hover:text-brand-blue/80"
          >
            개인정보처리방침
          </Link>
          과{' '}
          <Link
            to="/terms-of-service"
            className="font-semibold text-brand-blue underline underline-offset-2 hover:text-brand-blue/80"
          >
            이용약관
          </Link>
          을 확인해 주세요.
        </p>

        <div className="mt-[0.8rem] flex items-center justify-end">
          <div className="flex items-center gap-[0.8rem]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] px-[1.2rem] py-[0.8rem] text-ct4 font-semibold text-gray-60 hover:bg-gray-5"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] bg-brand-blue px-[1.6rem] py-[0.8rem] text-ct4 font-semibold text-white hover:bg-brand-blue/90"
            >
              동의하고 계속
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
