import { useState } from 'react';

import { IoChevronBack } from 'react-icons/io5';
import { MdCheckCircle, MdDone } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import useSignup from '@/services/mutations/useSignup';

export default function SignupPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'' | 'MALE' | 'FEMALE'>('');
  const [pwMessage, setPwMessage] = useState('');

  const [terms, setTerms] = useState({
    all: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  const signupMutation = useSignup();

  const handlePwValidation = () => {
    if (!pw || !pwConfirm) return;
    setPwMessage(pw !== pwConfirm ? '비밀번호가 일치하지 않습니다.' : '');
  };

  const handleAllTerms = () => {
    const allChecked = !terms.all;
    setTerms({
      all: allChecked,
      privacy: allChecked,
      age: allChecked,
      marketing: allChecked,
    });
  };

  const handleSignup = () => {
    if (
      !id ||
      !pw ||
      pw !== pwConfirm ||
      !name ||
      !age ||
      !terms.privacy ||
      !terms.age ||
      !gender
    ) {
      alert('필수 항목을 모두 입력하고 확인해주세요.');
      return;
    }
    signupMutation.mutate(
      { id, pw, name, age: Number(age), gender },
      {
        onSuccess: () => alert('회원가입 성공!'),
        onError: () => alert('회원가입 실패'),
      },
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-5 px-6 py-10">
      <div className="mb-6 flex w-full max-w-md items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-2xl text-gray-80"
        >
          <IoChevronBack />
        </button>
        <span className="mx-auto text-base font-semibold text-gray-80">
          회원가입
        </span>
        <div className="w-6" />
      </div>

      <div className="mb-8 w-full max-w-md">
        <h2 className="text-xl font-medium leading-7 text-gray-80">
          Eyedia와 함께
          <br />
          전시 경험을 높여보세요.
        </h2>
      </div>

      <div className="w-full max-w-md space-y-4">
        <TextInput
          placeholder="아이디"
          value={id}
          onChange={e => setId(e.target.value)}
          className="rounded-md border border-gray-10 bg-white px-4 py-3 shadow-sm"
        />
        <PasswordInput
          placeholder="비밀번호"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onBlur={handlePwValidation}
          className="rounded-md border border-gray-10 bg-white px-4 py-3 shadow-sm"
        />
        <PasswordInput
          placeholder="비밀번호 확인"
          value={pwConfirm}
          onChange={e => setPwConfirm(e.target.value)}
          onBlur={handlePwValidation}
          errorMessage={pwMessage}
          className="rounded-md border border-gray-10 bg-white px-4 py-3 shadow-sm"
        />
        <TextInput
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          className="rounded-md border border-gray-10 bg-white px-4 py-3 shadow-sm"
        />
        <TextInput
          placeholder="나이"
          type="number"
          value={age}
          onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
          className="rounded-md border border-gray-10 bg-white px-4 py-3 shadow-sm"
        />
        <select
          value={gender}
          onChange={e => setGender(e.target.value as 'MALE' | 'FEMALE')}
          className="w-full rounded-md border border-gray-10 bg-white px-4 py-3 text-sm text-gray-30 focus:border-brand-blue focus:text-gray-80 focus:outline-none focus:ring-1 focus:ring-brand-blue"
        >
          <option value="" disabled hidden>
            성별
          </option>
          <option value="FEMALE">여성</option>
          <option value="MALE">남성</option>
        </select>
      </div>
      <div className="mt-8 w-full max-w-md space-y-3 rounded-md bg-white p-4 shadow-sm">
        <div className="flex cursor-pointer items-center">
          <button
            type="button"
            onClick={handleAllTerms}
            className="mr-2 cursor-pointer text-2xl text-gray-30"
          >
            {terms.all ? (
              <MdCheckCircle className="text-brand-blue" />
            ) : (
              <MdCheckCircle className="text-gray-30" />
            )}
          </button>
          <span className="text-sm font-medium text-gray-80">
            서비스 약관 전체 동의
          </span>
        </div>
        <hr className="border-gray-10" />
        <div className="flex items-center justify-between">
          <div className="flex cursor-pointer items-center">
            <button
              type="button"
              onClick={() => setTerms({ ...terms, privacy: !terms.privacy })}
              className="mr-2 cursor-pointer text-2xl text-gray-30"
            >
              {terms.privacy ? (
                <MdDone className="text-brand-blue" />
              ) : (
                <MdDone className="text-gray-30" />
              )}
            </button>
            <span className="text-sm text-gray-80">
              [필수] 이용약관 및 개인정보 처리방침
            </span>
          </div>
          <span className="text-xs text-brand-blue underline">자세히</span>
        </div>
        <div className="flex items-center">
          <div className="flex cursor-pointer items-center">
            <button
              type="button"
              onClick={() => setTerms({ ...terms, age: !terms.age })}
              className="mr-2 cursor-pointer text-2xl text-gray-30"
            >
              {terms.age ? (
                <MdDone className="text-brand-blue" />
              ) : (
                <MdDone className="text-gray-30" />
              )}
            </button>
            <span className="text-sm text-gray-80">
              [필수] 만 14세 이상입니다.
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex cursor-pointer items-center">
            <button
              type="button"
              onClick={() =>
                setTerms({ ...terms, marketing: !terms.marketing })
              }
              className="mr-2 cursor-pointer text-2xl text-gray-30"
            >
              {terms.marketing ? (
                <MdDone className="text-brand-blue" />
              ) : (
                <MdDone className="text-gray-30" />
              )}
            </button>
            <span className="text-sm text-gray-80">
              [선택] 마케팅 정보 수집 및 수신 동의
            </span>
          </div>
          <span className="text-xs text-brand-blue underline">자세히</span>
        </div>
      </div>

      <div className="mt-8 w-full max-w-md">
        <Button
          onClick={handleSignup}
          className={`w-full rounded-md py-3 font-medium text-white ${
            !terms.privacy || !terms.age
              ? 'cursor-not-allowed bg-gray-30'
              : 'bg-brand-blue hover:bg-brand-blue/80'
          }`}
          disabled={!terms.privacy || !terms.age}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}
