import { useState } from 'react';

import CustomSelect, { SelectOption } from '@/components/auth/CustomSelect';
import SignupSuccess from '@/components/auth/SignupSuccess';
import StepPreference from '@/components/auth/StepPreference';
import TermsAgreement from '@/components/auth/TermsAgreement';
import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import { useToast } from '@/contexts/ToastContext';
import Header from '@/layouts/Header';
import useSignup from '@/services/mutations/useSignup';

type Gender = '' | 'MALE' | 'FEMALE';
type GenderStrict = Exclude<Gender, ''>;

const isGenderStrict = (g: Gender): g is GenderStrict =>
  g === 'MALE' || g === 'FEMALE';

export default function SignupPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('');
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [showPreference, setShowPreference] = useState(false);
  const [terms, setTerms] = useState({
    all: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  const [dirty, setDirty] = useState({
    id: false,
    pw: false,
    pwConfirm: false,
    name: false,
    age: false,
    gender: false,
  });

  const { showToast } = useToast();
  const signupMutation = useSignup();

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
      const next = { ...prev, [key]: !prev[key] };
      if (key !== 'all') next.all = next.privacy && next.age && next.marketing;
      return next;
    });
  };

  const genderOptions: SelectOption[] = [
    { label: '여성', value: 'FEMALE' },
    { label: '남성', value: 'MALE' },
  ];

  const validateId = (v: string) => {
    if (!v.trim()) return '아이디를 입력해 주세요.';
    if (v.length < 5 || v.length > 15)
      return '아이디는 5~15자로 입력해 주세요.';
    if (!/^[a-z0-9._-]+$/.test(v))
      return '영문 소문자, 숫자, . _ - 만 사용할 수 있어요.';
    if (!/^[a-z]/.test(v)) return '아이디는 영문 소문자로 시작해 주세요.';
    if (/(\.|_|-){2,}/.test(v)) return '구분 문자를 연속으로 사용할 수 없어요.';
    if (/^[._-]|[._-]$/.test(v)) return '구분 문자는 처음/끝에 올 수 없어요.';
    return undefined;
  };

  const validatePw = (v: string) => {
    if (!v) return '비밀번호를 입력해 주세요.';
    if (v.length < 8 || v.length > 18)
      return '비밀번호는 8~18자로 입력해 주세요.';
    if (/\s/.test(v)) return '공백은 사용할 수 없어요.';

    let types = 0;
    if (/[a-z]/.test(v)) types += 1;
    if (/[A-Z]/.test(v)) types += 1;
    if (/\d/.test(v)) types += 1;
    if (/[^A-Za-z0-9]/.test(v)) types += 1;
    if (types < 3)
      return '영문 대/소문자, 숫자, 특수문자 중 3가지 이상을 조합해 주세요.';

    if (id && id.length >= 3 && v.toLowerCase().includes(id.toLowerCase()))
      return '아이디를 비밀번호에 포함할 수 없어요.';
    if (
      name &&
      name.length >= 2 &&
      v.toLowerCase().includes(name.toLowerCase())
    )
      return '이름을 비밀번호에 포함할 수 없어요.';

    return undefined;
  };

  const validatePwConfirm = (pwV: string, confirmV: string) => {
    if (!confirmV) return '비밀번호를 한 번 더 입력해 주세요.';
    if (pwV !== confirmV) return '비밀번호가 일치하지 않아요.';
    return undefined;
  };

  const validateName = (v: string) => {
    if (!v.trim()) return '이름을 입력해 주세요.';
    if (v.length < 2) return '이름은 2자 이상이어야 해요.';
    return undefined;
  };

  const validateAge = (v: number | '') => {
    if (v === '') return '나이를 입력해 주세요.';
    if (v < 14 || v > 120) return '만 14세 이상만 가입할 수 있어요.';
    return undefined;
  };

  const validateGender = (v: Gender) => {
    if (!v) return '성별을 선택해 주세요.';
    return undefined;
  };

  const idError = dirty.id ? validateId(id) : undefined;
  const pwError = dirty.pw ? validatePw(pw) : undefined;
  const pwConfirmError = dirty.pwConfirm
    ? validatePwConfirm(pw, pwConfirm)
    : undefined;
  const nameError = dirty.name ? validateName(name) : undefined;
  const ageError = dirty.age ? validateAge(age) : undefined;
  const genderError = dirty.gender ? validateGender(gender) : undefined;

  const isFieldsValid =
    !validateId(id) &&
    !validatePw(pw) &&
    !validatePwConfirm(pw, pwConfirm) &&
    !validateName(name) &&
    !validateAge(age) &&
    !validateGender(gender);

  const canSubmit = isFieldsValid && terms.privacy && terms.age;

  const handleSignup = () => {
    if (!canSubmit || !isGenderStrict(gender)) return;

    signupMutation.mutate(
      { id, pw, name, age: Number(age), gender },
      {
        onSuccess: () => setShowPreference(true),
        onError: () =>
          showToast(
            '회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.',
            'error',
          ),
      },
    );
  };

  if (isSignupComplete) return <SignupSuccess name={name} />;
  if (showPreference)
    return <StepPreference onComplete={() => setIsSignupComplete(true)} />;

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

          <form
            className="w-full space-y-[2.5rem]"
            onSubmit={e => e.preventDefault()}
          >
            <div className="relative">
              <TextInput
                placeholder="아이디"
                value={id}
                onChange={e => {
                  setId(e.target.value);
                  if (!dirty.id) setDirty(d => ({ ...d, id: true }));
                }}
                aria-invalid={!!idError}
              />
              {idError && (
                <p
                  className="pointer-events-none absolute left-0 top-full translate-y-[0.3rem] pl-[0.5rem] text-red-500 ct4"
                  aria-live="polite"
                >
                  {idError}
                </p>
              )}
            </div>

            <div className="relative">
              <PasswordInput
                placeholder="비밀번호 (8자 이상)"
                value={pw}
                onChange={e => {
                  setPw(e.target.value);
                  if (!dirty.pw) setDirty(d => ({ ...d, pw: true }));
                  if (dirty.pwConfirm)
                    setDirty(d => ({ ...d, pwConfirm: true }));
                }}
                aria-invalid={!!pwError}
              />
              {pwError && (
                <p
                  className="pointer-events-none absolute left-0 top-full translate-y-[0.3rem] pl-[0.5rem] text-red-500 ct4"
                  aria-live="polite"
                >
                  {pwError}
                </p>
              )}
            </div>

            <div className="relative">
              <PasswordInput
                placeholder="비밀번호 확인"
                value={pwConfirm}
                onChange={e => {
                  setPwConfirm(e.target.value);
                  if (!dirty.pwConfirm)
                    setDirty(d => ({ ...d, pwConfirm: true }));
                }}
                aria-invalid={!!pwConfirmError}
              />
              {pwConfirmError && (
                <p
                  className="pointer-events-none absolute left-0 top-full translate-y-[0.3rem] pl-[0.5rem] text-red-500 ct4"
                  aria-live="polite"
                >
                  {pwConfirmError}
                </p>
              )}
            </div>

            <div className="relative">
              <TextInput
                placeholder="이름"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (!dirty.name) setDirty(d => ({ ...d, name: true }));
                }}
                aria-invalid={!!nameError}
              />
              {nameError && (
                <p
                  className="pointer-events-none absolute left-0 top-full translate-y-[0.3rem] pl-[0.5rem] text-red-500 ct4"
                  aria-live="polite"
                >
                  {nameError}
                </p>
              )}
            </div>

            <div className="relative">
              <TextInput
                placeholder="나이"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={3}
                value={age === '' ? '' : String(age)}
                onChange={e => {
                  const digits = e.target.value.replace(/\D+/g, '');
                  setAge(digits ? Number(digits) : '');
                  if (!dirty.age) setDirty(d => ({ ...d, age: true }));
                }}
                onKeyDown={e => {
                  if (e.nativeEvent?.isComposing) return;

                  const allow = [
                    'Backspace',
                    'Delete',
                    'Tab',
                    'ArrowLeft',
                    'ArrowRight',
                    'Home',
                    'End',
                  ];
                  if (allow.includes(e.key)) return;
                  if (!/^\d$/.test(e.key)) e.preventDefault();
                }}
                onPaste={e => {
                  const text = e.clipboardData.getData('text');
                  if (!/^\d+$/.test(text)) e.preventDefault();
                }}
                aria-invalid={!!ageError}
              />

              {ageError && (
                <p
                  className="pointer-events-none absolute left-0 top-full translate-y-[0.4rem] pl-[0.5rem] text-red-500 ct4"
                  aria-live="polite"
                >
                  {ageError}
                </p>
              )}
            </div>

            <div className="relative">
              <CustomSelect
                value={gender}
                onChange={val => {
                  setGender(val as 'MALE' | 'FEMALE');
                  if (!dirty.gender) setDirty(d => ({ ...d, gender: true }));
                }}
                options={genderOptions}
                placeholder="성별"
                className="mt-4"
                aria-invalid={!!genderError}
              />
              {genderError && (
                <p
                  className="pointer-events-none absolute left-0 top-full translate-y-[0.4rem] pl-[0.5rem] text-ct5 text-red-500"
                  aria-live="polite"
                >
                  {genderError}
                </p>
              )}
            </div>
          </form>
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
                !canSubmit
                  ? 'cursor-not-allowed bg-gray-30'
                  : 'bg-brand-blue hover:bg-brand-blue/80'
              }`}
              disabled={!canSubmit}
            >
              회원가입
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
