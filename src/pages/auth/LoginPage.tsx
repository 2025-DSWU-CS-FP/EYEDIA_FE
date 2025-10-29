import { useEffect, useState, useCallback } from 'react';

import Player from 'lottie-react';
import { useNavigate } from 'react-router-dom';

import logoLottie from '@/assets/lottie/logo.json';
import splashLottie from '@/assets/lottie/splash.json';
import GoogleLoginButton from '@/components/auth/SocialButtons/google-login-button';
import NaverLoginButton from '@/components/auth/SocialButtons/naver-login-button';
import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import { useToast } from '@/contexts/ToastContext';
import useLogin from '@/services/mutations/useLogin';

const API_BASE = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
).replace(/\/+$/, '');

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [idError, setIdError] = useState('');
  const [pwError, setPwError] = useState('');
  const [isSocialRedirecting, setIsSocialRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginMutation = useLogin();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const goSocial = useCallback(
    (registrationId: 'naver' | 'google') => {
      if (!API_BASE) {
        showToast(
          'API_BASE가 설정되지 않았습니다. 환경 변수를 확인해주세요.',
          'error',
        );
        return;
      }
      if (isSocialRedirecting) return;
      setIsSocialRedirecting(true);
      try {
        window.location.replace(
          `${API_BASE}/oauth2/authorization/${registrationId}`,
        );
      } catch {
        setIsSocialRedirecting(false);
        showToast(
          '소셜 로그인 진입에 실패했습니다. 잠시 후 다시 시도해주세요.',
          'error',
        );
      }
    },
    [isSocialRedirecting, showToast],
  );

  const handleLogin = useCallback(() => {
    if (isSubmitting) return;

    setIdError('');
    setPwError('');

    if (!id || !pw) {
      if (!id && !pw) showToast('아이디와 비밀번호를 입력해주세요.', 'error');
      else if (!id) {
        setIdError('아이디를 입력해주세요.');
        showToast('아이디를 입력해주세요.', 'error');
      } else {
        setPwError('비밀번호를 입력해주세요.');
        showToast('비밀번호를 입력해주세요.', 'error');
      }
      return;
    }

    setIsSubmitting(true);
    loginMutation.mutate(
      { id, pw },
      {
        onSuccess: data => {
          const {
            token: accessToken,
            firstLogin,
            name,
            monthlyVisitCount,
          } = data;
          try {
            localStorage.setItem('accessToken', accessToken);
            if (name) localStorage.setItem('name', name);
            if (typeof monthlyVisitCount === 'number') {
              localStorage.setItem(
                'monthlyVisitCount',
                String(monthlyVisitCount),
              );
            }
          } catch {
            showToast(
              '로그인 정보를 저장할 수 없습니다. 브라우저 설정을 확인해 주세요.',
              'error',
            );
            setIsSubmitting(false);
            return;
          }
          showToast('로그인에 성공했습니다!', 'success');
          navigate(firstLogin ? '/landing' : '/', { replace: true });
        },
        onError: () => {
          showToast('아이디 혹은 비밀번호를 잘못 입력하였습니다.', 'error');
          setIsSubmitting(false);
        },
      },
    );
  }, [id, pw, isSubmitting, loginMutation, navigate, showToast]);

  if (showSplash) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#769DFF]">
        <Player
          autoplay
          loop
          animationData={splashLottie}
          className="mb-[7rem] w-[18rem]"
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-5 px-[2.5rem]">
      <section className="flex h-full w-full flex-col items-center justify-between gap-[2rem]">
        <header className="flex flex-col items-center gap-[1rem]">
          <Player
            autoplay
            loop={false}
            animationData={logoLottie}
            className="w-[12.5rem]"
          />
          <h1 className="font-bold text-gray-50 t2">EYEDIA</h1>
        </header>

        <section className="w-full space-y-[1rem] text-gray-80 placeholder-gray-30">
          <TextInput
            placeholder="아이디"
            value={id}
            onChange={e => setId(e.target.value)}
            errorMessage={idError}
            className="ct3"
            autoComplete="username"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const el = document.getElementById('password-input');
                if (el instanceof HTMLInputElement) el.focus();
              }
            }}
          />
          <PasswordInput
            id="password-input"
            placeholder="비밀번호"
            value={pw}
            onChange={e => setPw(e.target.value)}
            errorMessage={pwError}
            className="ct3"
            autoComplete="current-password"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
              }
            }}
          />
        </section>

        <section className="flex w-full flex-col gap-[2.2rem] text-gray-0">
          <Button
            className="bg-brand-blue"
            onClick={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중…' : '로그인'}
          </Button>

          <hr />

          <div className="flex flex-col gap-[1rem]">
            <NaverLoginButton onClick={() => goSocial('naver')} />
            <GoogleLoginButton onClick={() => goSocial('google')} />
          </div>

          <nav
            aria-label="보조 링크"
            className="flex items-center justify-center gap-[1.2rem] text-gray-70 ct4"
          >
            <button type="button">아이디 찾기</button>
            <span className="h-[1.2rem] w-px bg-gray-300" />
            <button type="button">비밀번호 찾기</button>
            <span className="h-[1.2rem] w-px bg-gray-300" />
            <button
              onClick={() => navigate('/signup')}
              aria-label="회원가입으로 이동"
              type="button"
            >
              회원가입
            </button>
          </nav>
        </section>
      </section>
    </main>
  );
}
