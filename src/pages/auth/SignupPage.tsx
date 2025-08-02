import { useState } from 'react';

import CustomSelect, { SelectOption } from '@/components/auth/CustomSelect';
import SignupSuccess from '@/components/auth/SignupSuccess';
import TermsAgreement from '@/components/auth/TermsAgreement';
import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import { useToast } from '@/contexts/ToastContext';
import Header from '@/layouts/Header';
import useSignup from '@/services/mutations/useSignup';

export default function SignupPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'' | 'MALE' | 'FEMALE'>('');
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [terms, setTerms] = useState({
    all: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  const { showToast } = useToast();

  const handleAllTerms = () => {
    const allChecked = !terms.all;
    setTerms({
      all: allChecked,
      privacy: allChecked,
      age: allChecked,
      marketing: allChecked,
    });
  };

  const handleToggleTerm = (key: keyof typeof terms) => {
    setTerms(prev => {
      const newTerms = {
        ...prev,
        [key]: !prev[key],
      };

      if (key !== 'all') {
        newTerms.all = newTerms.privacy && newTerms.age && newTerms.marketing;
      }

      return newTerms;
    });
  };

  const genderOptions: SelectOption[] = [
    { label: '여성', value: 'FEMALE' },
    { label: '남성', value: 'MALE' },
  ];

  const signupMutation = useSignup();

  const handlePwValidation = () => {
    if (pw && pwConfirm && pw !== pwConfirm) {
      showToast('비밀번호가 일치하지 않습니다.', 'error');
    }
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
      showToast('필수 항목을 모두 입력하고 확인해주세요.', 'error');
      return;
    }
    signupMutation.mutate(
      { id, pw, name, age: Number(age), gender },
      {
        onSuccess: () => {
          setIsSignupComplete(true);
        },
        onError: () => showToast('회원가입 실패', 'error'),
      },
    );
  };
  if (isSignupComplete) return <SignupSuccess name={name} />;
  return (
    <div className="flex min-h-screen flex-col bg-gray-5">
      <Header
        title="회원가입"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />

      <div className="flex flex-1 flex-col justify-between px-[2.5rem] pb-[2.5rem]">
        <div className="flex flex-col gap-[2rem] pt-[3rem]">
          <div className="mb-8 w-full">
            <h2 className="flex flex-col gap-[0.4rem] text-t3 font-medium text-gray-80">
              <span>Eyedia와 함께</span>
              <span>전시 경험을 높여보세요.</span>
            </h2>
          </div>

          <div className="w-full space-y-4">
            <TextInput
              placeholder="아이디"
              value={id}
              onChange={e => setId(e.target.value)}
            />
            <PasswordInput
              placeholder="비밀번호"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onBlur={handlePwValidation}
            />
            <PasswordInput
              placeholder="비밀번호 확인"
              value={pwConfirm}
              onChange={e => setPwConfirm(e.target.value)}
              onBlur={handlePwValidation}
            />
            <TextInput
              placeholder="이름"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <TextInput
              placeholder="나이"
              type="number"
              value={age}
              onChange={e =>
                setAge(e.target.value ? Number(e.target.value) : '')
              }
            />
            <CustomSelect
              value={gender}
              onChange={val => setGender(val as 'MALE' | 'FEMALE')}
              options={genderOptions}
              placeholder="성별"
              className="mt-4"
            />
          </div>
        </div>

        <div>
          <TermsAgreement
            terms={terms}
            onAllToggle={handleAllTerms}
            onToggle={handleToggleTerm}
          />

          <div className="mt-8 w-full">
            <Button
              onClick={handleSignup}
              className={`w-full py-[1.2rem] text-white ${
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
      </div>
    </div>
  );
}
