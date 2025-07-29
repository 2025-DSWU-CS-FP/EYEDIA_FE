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
    <div className="min-h-screen px-[2.5rem] bg-gray-5 flex flex-col pt-[12rem] items-center p-6">
      <div className="flex flex-col items-center w-full justify-between h-[37rem]">
        <div className="flex flex-col items-center gap-[1.4rem]">
          <img src="/logo-login.svg" alt="로고" className="w-[12.5rem]" />
          <span className="text-gray-50 text-t3 font-bold">EYEDIA</span>
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
        <div className="w-full flex flex-col text-gray-0 gap-[2.2rem]">
          <Button onClick={handleLogin}>로그인</Button>
          <div className="flex justify-center items-center space-x-3 text-ct4 text-gray-80">
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
    </div>
  );
}
