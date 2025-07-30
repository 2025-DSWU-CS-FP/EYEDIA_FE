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
    <div className="flex min-h-screen flex-col items-center bg-gray-5 p-6 px-[2.5rem] pt-[12rem]">
      <div className="flex h-[37rem] w-full flex-col items-center justify-between">
        <div className="flex flex-col items-center gap-[1.4rem]">
          <img src="/logo-login.svg" alt="로고" className="w-[12.5rem]" />
          <span className="text-t3 font-bold text-gray-50">EYEDIA</span>
        </div>
        <div className="w-full space-y-[0.8rem] text-gray-80 placeholder-gray-30">
          <TextInput
            placeholder="아이디"
            value={id}
            onChange={e => setId(e.target.value)}
            errorMessage={idError}
            className="text-ct3"
          />
          <PasswordInput
            placeholder="비밀번호"
            value={pw}
            onChange={e => setPw(e.target.value)}
            errorMessage={pwError}
            className="text-ct3"
          />
        </div>
        <div className="flex w-full flex-col gap-[2.2rem] text-gray-0">
          <Button onClick={handleLogin}>로그인</Button>
          <div className="flex items-center justify-center space-x-3 text-ct4 text-gray-80">
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
