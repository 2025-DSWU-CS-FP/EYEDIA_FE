import { useState } from 'react';

import { MdCheckCircle, MdDone } from 'react-icons/md';

import CookieModal from '@/components/common/CookieModal';

interface Terms {
  all: boolean;
  privacy: boolean;
  age: boolean;
  marketing: boolean;
}
interface TermsAgreementProps {
  terms: Terms;
  onAllToggle: () => void;
  onToggle: (key: keyof Terms) => void;
}

export default function TermsAgreement({
  terms,
  onAllToggle,
  onToggle,
}: TermsAgreementProps) {
  const [openCookie, setOpenCookie] = useState(false);

  return (
    <section className="mt-12 w-full space-y-5 rounded-[8px] p-6">
      <button
        type="button"
        onClick={onAllToggle}
        className="flex w-full cursor-pointer items-center text-left"
      >
        <MdCheckCircle
          className={
            terms.all
              ? 'mr-3 text-3xl text-brand-blue'
              : 'mr-3 text-3xl text-gray-30'
          }
        />
        <span className="text-bd2 text-gray-80">서비스 약관 전체 동의</span>
      </button>

      <hr className="border-gray-10" />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onToggle('privacy')}
          className="flex cursor-pointer items-center"
        >
          <MdDone
            className={
              terms.privacy
                ? 'mr-3 text-3xl text-brand-blue'
                : 'mr-3 text-3xl text-gray-30'
            }
          />
          <span className="text-bd2 text-gray-80">
            [필수] 이용약관 및 개인정보 처리방침
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpenCookie(true)}
          className="text-ct4 font-semibold text-brand-blue underline"
        >
          자세히
        </button>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onToggle('age')}
          className="flex cursor-pointer items-center"
        >
          <MdDone
            className={
              terms.age
                ? 'mr-3 text-3xl text-brand-blue'
                : 'mr-3 text-3xl text-gray-30'
            }
          />
          <span className="text-bd2 text-gray-80">
            [필수] 만 14세 이상입니다.
          </span>
        </button>
      </div>

      {openCookie && (
        <div className="fixed inset-0 z-[999]">
          <div
            className="fixed inset-0 mx-auto w-full max-w-[43rem] bg-black/20"
            onClick={() => setOpenCookie(false)}
            aria-hidden="true"
          />

          <div className="absolute inset-0">
            <div className="mx-auto flex h-full w-full max-w-[43rem] items-center justify-center px-[2rem]">
              <CookieModal onClose={() => setOpenCookie(false)} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
