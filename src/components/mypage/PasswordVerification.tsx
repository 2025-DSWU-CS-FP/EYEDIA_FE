import { useState } from 'react';

import Player from 'lottie-react';

import editLottie from '@/assets/lottie/edit-profile.json';
import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import { useToast } from '@/contexts/ToastContext';
import useVerifyPassword from '@/services/mutations/useVerifyPassword';
import type { UserInfo } from '@/types/user';

interface Props {
  onSuccess: (info: UserInfo) => void;
}

export default function PasswordVerification({ onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const verifyMutation = useVerifyPassword();
  const { showToast } = useToast();
  const handleVerify = () => {
    if (!password) {
      showToast('비밀번호를 입력해주세요.', 'error');
      return;
    }
    verifyMutation.mutate(password, {
      onSuccess: res => {
        if (res.verified) {
          setError('');
          showToast('인증이 완료되었습니다.', 'success');
          onSuccess(res.userInfo);
        } else showToast('비밀번호가 일치하지 않습니다.', 'error');
      },
      onError: () => showToast('비밀번호가 일치하지 않습니다.', 'error'),
    });
  };

  return (
    <section className="flex flex-col gap-[6rem]">
      <div className="flex flex-col items-center gap-[1.6rem] pt-[5rem]">
        <Player
          autoplay
          loop
          animationData={editLottie}
          className="w-[12.5rem]"
        />
        <div className="flex flex-col items-center gap-[0.8rem] text-gray-100">
          <span className="t3">비밀번호를 입력해주세요</span>
          <span className="bd2">
            개인정보 보호를 위해 비밀번호 확인이 필요합니다.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[4rem] px-[2.5rem]">
        <PasswordInput
          placeholder="비밀번호"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          errorMessage={error}
        />
        <Button
          className="bg-brand-blue bt1"
          onClick={handleVerify}
          disabled={verifyMutation.isPending}
          aria-busy={verifyMutation.isPending}
        >
          다음
        </Button>
      </div>
    </section>
  );
}
