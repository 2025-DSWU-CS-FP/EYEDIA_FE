import { useState } from 'react';

import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import useSignup from '@/services/mutations/useSignup';

export default function SignupPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('FEMALE');
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
      !terms.age
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
    <div className="min-h-screen bg-gray-5 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-md flex items-center mb-6">
        <span className="text-base font-semibold text-gray-80">회원가입</span>
      </div>

      <div className="w-full max-w-md mb-8">
        <h2 className="text-xl font-medium text-gray-80 leading-7">
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
          className="bg-white shadow-sm rounded-md border border-gray-10 px-4 py-3"
        />
        <PasswordInput
          placeholder="비밀번호"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onBlur={handlePwValidation}
          className="bg-white shadow-sm rounded-md border border-gray-10 px-4 py-3"
        />
        <PasswordInput
          placeholder="비밀번호 확인"
          value={pwConfirm}
          onChange={e => setPwConfirm(e.target.value)}
          onBlur={handlePwValidation}
          errorMessage={pwMessage}
          className="bg-white shadow-sm rounded-md border border-gray-10 px-4 py-3"
        />
        <TextInput
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          className="bg-white shadow-sm rounded-md border border-gray-10 px-4 py-3"
        />
        <TextInput
          placeholder="나이"
          type="number"
          value={age}
          onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
          className="bg-white shadow-sm rounded-md border border-gray-10 px-4 py-3"
        />
        <select
          value={gender}
          onChange={e => setGender(e.target.value as 'MALE' | 'FEMALE')}
          className="w-full px-4 py-3 bg-white border border-gray-10 rounded-md text-sm text-gray-80"
        >
          <option value="FEMALE">여성</option>
          <option value="MALE">남성</option>
        </select>
      </div>

      <div className="w-full max-w-md mt-8 bg-white rounded-md p-4 shadow-sm space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={terms.all}
            onChange={handleAllTerms}
            className="mr-2 accent-indigo-400"
          />
          <span className="font-medium text-sm text-gray-80">
            서비스 약관 전체 동의
          </span>
        </div>
        <hr className="border-gray-10" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={terms.privacy}
              onChange={e => setTerms({ ...terms, privacy: e.target.checked })}
              className="mr-2 accent-indigo-400"
            />
            <span className="text-sm text-gray-80">
              [필수] 이용약관 및 개인정보 처리방침
            </span>
          </div>
          <span className="text-xs text-brand-blue underline">자세히</span>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={terms.age}
            onChange={e => setTerms({ ...terms, age: e.target.checked })}
            className="mr-2 accent-indigo-400"
          />
          <span className="text-sm text-gray-80">
            [필수] 만 14세 이상입니다.
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={terms.marketing}
              onChange={e =>
                setTerms({ ...terms, marketing: e.target.checked })
              }
              className="mr-2 accent-indigo-400"
            />
            <span className="text-sm text-gray-80">
              [선택] 마케팅 정보 수집 및 수신 동의
            </span>
          </div>
          <span className="text-xs text-brand-blue underline">자세히</span>
        </div>
      </div>

      <div className="w-full max-w-md mt-8">
        <Button
          onClick={handleSignup}
          className={`w-full py-3 rounded-md text-white font-medium ${
            !terms.privacy || !terms.age
              ? 'bg-gray-30 cursor-not-allowed'
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
