import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import useLogin from '@/services/mutations/useLogin';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!id || !pw) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    loginMutation.mutate(
      { id, pw },
      {
        onSuccess: data => {
          alert('Login success!');
          localStorage.setItem('accessToken', data.accessToken);
          navigate('/');
        },
        onError: () => alert('Login failed'),
      },
    );
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="p-8 w-full">
        <h2 className="text-xl font-bold mb-6">로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={e => setId(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={e => setPw(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="button"
          aria-label="로그인"
          onClick={handleLogin}
          className="w-full text-black py-3 rounded font-semibold hover:bg-gray-300 bg-gray-200 transition"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
