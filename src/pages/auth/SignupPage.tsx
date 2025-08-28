import { useState } from 'react';

import CustomSelect from '@/components/auth/CustomSelect';
import SignupSuccess from '@/components/auth/SignupSuccess';
import StepPreference from '@/components/auth/StepPreference';
import TermsAgreement from '@/components/auth/TermsAgreement';
import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import { useToast } from '@/contexts/ToastContext';
import useSignupForm from '@/hooks/useSignupForm';
import Header from '@/layouts/Header';
import useSignup from '@/services/mutations/useSignup';
import { isGenderStrict } from '@/types';

export default function SignupPage() {
  const {
    id,
    pw,
    pwConfirm,
    name,
    age,
    gender,
    terms,
    idError,
    pwError,
    pwConfirmError,
    nameError,
    ageError,
    genderError,
    canSubmit,
    genderOptions,
    onChangeId,
    onChangePw,
    onChangePwConfirm,
    onChangeName,
    onChangeAgeText,
    onChangeGender,
    onAllToggle,
    onToggle,
  } = useSignupForm();

  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [showPreference, setShowPreference] = useState(false);

  const { showToast } = useToast();
  const signupMutation = useSignup();

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
                onChange={e => onChangeId(e.target.value)}
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
                onChange={e => onChangePw(e.target.value)}
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
                onChange={e => onChangePwConfirm(e.target.value)}
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
                onChange={e => onChangeName(e.target.value)}
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
                onChange={e => onChangeAgeText(e.target.value)}
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
                onChange={val => onChangeGender(val as 'MALE' | 'FEMALE')}
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
            onAllToggle={onAllToggle}
            onToggle={onToggle}
          />

          <div className="mt-8 w-full">
            <Button
              onClick={handleSignup}
              className={`w-full py-[1.2rem] text-white ${!canSubmit ? 'bg-gray-30' : 'bg-brand-blue hover:bg-brand-blue/80'}`}
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
