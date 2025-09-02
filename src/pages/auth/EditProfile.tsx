import { useState } from 'react';

import PasswordVerification from '@/components/mypage/PasswordVerification';
import ProfileEdit from '@/components/mypage/ProfileEdit';
import Header from '@/layouts/Header';
import type { UserInfo } from '@/types/user';

export default function EditProfilePage() {
  const [step, setStep] = useState<'verify' | 'edit'>('verify');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  return (
    <main className="flex w-full flex-col">
      <Header
        title="내 정보 수정"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />
      {step === 'verify' ? (
        <PasswordVerification
          onSuccess={info => {
            setUserInfo(info);
            setStep('edit');
          }}
        />
      ) : (
        <ProfileEdit
          initialNickname={userInfo?.username ?? ''}
          initialUserId={userInfo?.id ?? ''}
        />
      )}
    </main>
  );
}
