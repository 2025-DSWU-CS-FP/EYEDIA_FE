import { useEffect, useState } from 'react';

import Player from 'lottie-react';
import { useNavigate } from 'react-router-dom';

import logoLottie from '@/assets/lottie/logo.json';
import splashLottie from '@/assets/lottie/splash.json';
import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import { useToast } from '@/contexts/ToastContext';
import useLogin from '@/services/mutations/useLogin';

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [idError, setIdError] = useState('');
  const [pwError, setPwError] = useState('');

  const loginMutation = useLogin();
  const navigate = useNavigate();

  const { showToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIdError('');
    setPwError('');

    if (!id || !pw) {
      if (!id && !pw) {
        showToast('아이디와 비밀번호를 입력해주세요.', 'error');
      } else if (!id) {
        showToast('아이디를 입력해주세요.', 'error');
      } else if (!pw) {
        showToast('비밀번호를 입력해주세요.', 'error');
      }
      return;
    }

    loginMutation.mutate(
      { id, pw },
      {
        onSuccess: data => {
          const { accessToken, firstLogin } = (data ?? {}) as {
            accessToken?: string;
            firstLogin?: boolean;
          };

          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
          }

          showToast('로그인에 성공했습니다!', 'success');

          navigate(firstLogin ? '/landing' : '/');
        },
        onError: () => {
          showToast('아이디 혹은 비밀번호를 잘못 입력하였습니다.', 'error');
        },
      },
    );
  };

  if (showSplash) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#769DFF]">
        <Player
          autoplay
          loop
          animationData={splashLottie}
          className="mb-[7rem] w-[18rem]"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-5 p-6 px-[2.5rem] pt-[12rem]">
      <div className="flex h-[37rem] w-full flex-col items-center justify-between">
        <div className="flex flex-col items-center gap-[1rem]">
          <Player
            autoplay
            loop={false}
            animationData={logoLottie}
            className="w-[12.5rem]"
          />
          <span className="font-bold text-gray-50 t2">EYEDIA</span>
        </div>

        <div className="w-full space-y-[1rem] text-gray-80 placeholder-gray-30">
          <TextInput
            placeholder="아이디"
            value={id}
            onChange={e => setId(e.target.value)}
            errorMessage={idError}
            className="ct3"
          />
          <PasswordInput
            placeholder="비밀번호"
            value={pw}
            onChange={e => setPw(e.target.value)}
            errorMessage={pwError}
            className="ct3"
          />
        </div>

        <div className="flex w-full flex-col gap-[2.2rem] text-gray-0">
          <Button className="bg-brand-blue" onClick={handleLogin}>
            로그인
          </Button>
          <div className="flex items-center justify-center space-x-3 text-gray-70 ct4">
            <button type="button">아이디 찾기</button>
            <span className="h-3.5 w-px bg-gray-300" />
            <button type="button">비밀번호 찾기</button>
            <span className="h-3.5 w-px bg-gray-300" />
            <button
              onClick={() => navigate('/signup')}
              aria-label="button"
              type="button"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
