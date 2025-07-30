import { MdCheckCircle, MdDone } from 'react-icons/md';

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
  return (
    <div className="mt-12 w-full space-y-5 rounded-lg p-6">
      <div className="flex cursor-pointer items-center">
        <button
          type="button"
          onClick={onAllToggle}
          className="mr-3 cursor-pointer text-3xl text-gray-30"
        >
          <MdCheckCircle
            className={terms.all ? 'text-brand-blue' : 'text-gray-30'}
          />
        </button>
        <span className="text-bd2 text-gray-80">서비스 약관 전체 동의</span>
      </div>

      <hr className="border-gray-10" />

      <div className="flex items-center justify-between">
        <div className="flex cursor-pointer items-center">
          <button
            type="button"
            onClick={() => onToggle('privacy')}
            className="mr-3 cursor-pointer text-3xl text-gray-30"
          >
            <MdDone
              className={terms.privacy ? 'text-brand-blue' : 'text-gray-30'}
            />
          </button>
          <span className="text-bd2 text-gray-80">
            [필수] 이용약관 및 개인정보 처리방침
          </span>
        </div>
        <span className="text-ct4 text-brand-blue underline">자세히</span>
      </div>

      <div className="flex items-center">
        <div className="flex cursor-pointer items-center">
          <button
            type="button"
            onClick={() => onToggle('age')}
            className="mr-3 cursor-pointer text-3xl text-gray-30"
          >
            <MdDone
              className={terms.age ? 'text-brand-blue' : 'text-gray-30'}
            />
          </button>
          <span className="text-bd2 text-gray-80">
            [필수] 만 14세 이상입니다.
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex cursor-pointer items-center">
          <button
            type="button"
            onClick={() => onToggle('marketing')}
            className="mr-3 cursor-pointer text-3xl text-gray-30"
          >
            <MdDone
              className={terms.marketing ? 'text-brand-blue' : 'text-gray-30'}
            />
          </button>
          <span className="text-bd2 text-gray-80">
            [선택] 마케팅 정보 수집 및 수신 동의
          </span>
        </div>
        <span className="text-ct4 text-brand-blue underline">자세히</span>
      </div>
    </div>
  );
}
