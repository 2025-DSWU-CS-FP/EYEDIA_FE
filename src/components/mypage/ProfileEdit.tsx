import { useState } from 'react';

import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import { useToast } from '@/contexts/ToastContext';

export default function ProfileEdit() {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingUserId, setIsEditingUserId] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const { showToast } = useToast();

  const [nickname, setNickname] = useState('기존 닉네임');
  const [userId, setUserId] = useState('eyedia');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  return (
    <div className="flex flex-col gap-[2.4rem] px-[2.4rem] py-[4rem]">
      <h2 className="flex flex-col gap-[0.4rem] text-gray-80 t3">
        <span>Eyedia에서 새롭게 사용할</span>
        <span>정보를 입력해 주세요.</span>
      </h2>

      <div className="flex flex-col gap-[2rem]">
        <section className="flex flex-col gap-[0.8rem]">
          <span className="text-gray-60 ct4">닉네임</span>
          <div className="flex items-start justify-between gap-[0.6rem]">
            <div className="flex flex-[3] flex-col gap-[0.4rem]">
              <TextInput
                id="nickname"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="새 닉네임 입력"
              />
            </div>
            <div className="flex-[1]">
              <Button
                className="w-full"
                onClick={() => {
                  if (isEditingNickname) {
                    showToast('닉네임이 수정되었습니다.', 'success');
                  }
                  setIsEditingNickname(prev => !prev);
                }}
              >
                {isEditingNickname ? '완료' : '변경하기'}
              </Button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-[0.8rem]">
          <span className="text-gray-60 ct4">아이디</span>
          <div className="flex items-start justify-between gap-[0.6rem]">
            <div className="flex flex-[3] flex-col gap-[0.4rem]">
              <TextInput
                id="user-id"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="새 아이디 입력"
              />
            </div>
            <div className="flex-[1]">
              <Button
                className="w-full"
                onClick={() => {
                  if (isEditingUserId) {
                    showToast('아이디가 수정되었습니다.', 'info');
                  }
                  setIsEditingUserId(prev => !prev);
                }}
              >
                {isEditingUserId ? '완료' : '변경하기'}
              </Button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-[0.8rem]">
          <span className="text-gray-60 ct4">비밀번호</span>
          <div className="flex flex-col gap-[0.8rem]">
            {isEditingPassword ? (
              <div className="flex flex-col gap-[1rem]">
                <PasswordInput
                  id="password"
                  placeholder="새 비밀번호"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <PasswordInput
                  placeholder="새 비밀번호 확인"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                />
                <Button
                  onClick={() => {
                    setIsEditingPassword(false);
                    showToast('비밀번호가 수정되었습니다.', 'error');
                  }}
                >
                  완료
                </Button>
              </div>
            ) : (
              <Button
                id="change-password"
                className="w-full"
                onClick={() => setIsEditingPassword(true)}
              >
                비밀번호 변경하기
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
