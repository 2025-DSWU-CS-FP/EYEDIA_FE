import { useNavigate } from 'react-router-dom';

import successImg from '@/assets/icons/success-signup.svg';
import Button from '@/components/common/Button';

interface SignupSuccessProps {
  name: string;
}

export default function SignupSuccess({ name }: SignupSuccessProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-around bg-gray-5 px-[2.5rem]">
      <div className="flex flex-col items-center gap-[1.7rem]">
        <img src={successImg} alt="성공 아이콘" className="w-[20rem]" />
        <span className="text-center text-t3 font-medium text-brand-blue">
          <span className="font-bold text-gray-80">{name}</span>님,
          <br />
          회원가입을 축하합니다!
        </span>
      </div>
      <div className="flex w-full flex-col gap-[2.2rem] text-gray-0">
        <Button onClick={() => navigate('/login')}>로그인하러 가기</Button>
      </div>
    </div>
  );
}
