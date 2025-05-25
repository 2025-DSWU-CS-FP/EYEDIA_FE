import { useState } from 'react';

import useSignup from '@/services/mutations/useSignup';

export default function SignupPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(20);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('FEMALE');
  const signupMutation = useSignup();

  const handleSignup = () => {
    signupMutation.mutate(
      { id, pw, name, age, gender },
      {
        onSuccess: () => alert('회원가입 성공!'),
        onError: () => alert('회원가입 실패'),
      },
    );
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="p-8">
        <h2 className="text-xl font-bold mb-6">회원가입</h2>
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
          className="w-full p-3 mb-4 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="number"
          placeholder="나이"
          value={age}
          onChange={e => setAge(Number(e.target.value))}
          className="w-full p-3 mb-4 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <select
          value={gender}
          onChange={e => setGender(e.target.value as 'MALE' | 'FEMALE')}
          className="w-full p-3 mb-6 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="FEMALE">여성</option>
          <option value="MALE">남성</option>
        </select>

        <button
          type="button"
          aria-label="로그인"
          onClick={handleSignup}
          className="w-full bg-white text-black py-3 rounded font-semibold bg-gray-200 hover:bg-gray-300 transition"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
