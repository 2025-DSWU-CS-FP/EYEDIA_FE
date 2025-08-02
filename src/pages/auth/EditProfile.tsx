import { useState } from 'react';

import PasswordVerification from '@/components/mypage/PasswordVerification';
import ProfileEdit from '@/components/mypage/ProfileEdit';
import Header from '@/layouts/Header';

export default function EditProfilePage() {
  const [step, setStep] = useState<'verify' | 'edit'>('verify');

  return (
    <div className="flex w-full flex-col">
      <Header
        title="내 정보 수정"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />
      {step === 'verify' ? (
        <PasswordVerification onSuccess={() => setStep('edit')} />
      ) : (
        <ProfileEdit />
      )}
    </div>
  );
}
