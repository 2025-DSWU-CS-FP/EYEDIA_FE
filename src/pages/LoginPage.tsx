import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import useLogin from '@/services/mutations/useLogin';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const [idError, setIdError] = useState('');
  const [pwError, setPwError] = useState('');

  const handleLogin = () => {
    setIdError('');
    setPwError('');

    if (!id) setIdError('아이디를 입력해주세요.');
    if (!pw) setPwError('비밀번호를 입력해주세요.');

    if (!id || !pw) return;

    loginMutation.mutate(
      { id, pw },
      {
        onSuccess: data => {
          localStorage.setItem('accessToken', data.accessToken);
          navigate('/');
        },
        onError: () => {
          setPwError('아이디 혹은 비밀번호를 잘못 입력하였습니다.');
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-5 flex flex-col justify-between items-center p-6">
      <div className="flex flex-col items-center w-full mt-16">
        <div className="flex flex-col items-center space-y-2">
          <img src="/logo-login.svg" alt="로고" />
          <div className="text-black font-bold text-base mt-2">Eyedia</div>
        </div>
        <div className="w-full max-w-sm mt-12 space-y-4">
          <TextInput
            placeholder="아이디"
            value={id}
            onChange={e => setId(e.target.value)}
            errorMessage={idError}
          />
          <PasswordInput
            placeholder="비밀번호"
            value={pw}
            onChange={e => setPw(e.target.value)}
            errorMessage={pwError}
          />
        </div>

        <Button
          onClick={handleLogin}
          className="w-full max-w-sm bg-brand-blue text-white text-base font-medium py-3 rounded-md hover:bg-brand-blue/80 mt-6"
        >
          로그인
        </Button>

        <div className="flex justify-center items-center space-x-3 text-xs text-gray-700 mt-4">
          <button type="button">아이디 찾기</button>
          <span className="w-px h-3.5 bg-gray-300" />
          <button type="button">비밀번호 찾기</button>
          <span className="w-px h-3.5 bg-gray-300" />
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
  );
}
