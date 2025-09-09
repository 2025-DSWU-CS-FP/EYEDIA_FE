import { useState, useMemo, useCallback } from 'react';

import type { AxiosError } from 'axios';

import Button from '@/components/common/Button';
import PasswordInput from '@/components/common/PasswordInput';
import TextInput from '@/components/common/TextInput';
import { useToast } from '@/contexts/ToastContext';
import useUpdateLoginId from '@/services/mutations/useUpdateLoginId';
import useUpdateNickname from '@/services/mutations/useUpdateNickname';

interface ProfileEditProps {
  initialNickname: string;
  initialUserId: string;
}

function getErrorMessage(e: unknown, field: 'nickname' | 'loginId'): string {
  const ax = e as AxiosError<{
    message?: string;
    result?: Record<string, string>;
  }>;
  const res = ax?.response?.data;
  return res?.result?.[field] || res?.message || '요청을 처리하지 못했습니다.';
}

export default function ProfileEdit({
  initialNickname,
  initialUserId,
}: ProfileEditProps) {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingUserId, setIsEditingUserId] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const { showToast } = useToast();

  const [nickname, setNickname] = useState(initialNickname);
  const [userId, setUserId] = useState(initialUserId);
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const nicknameChanged = useMemo(
    () => nickname.trim() !== initialNickname.trim(),
    [nickname, initialNickname],
  );
  const loginIdChanged = useMemo(
    () => userId.trim() !== initialUserId.trim(),
    [userId, initialUserId],
  );

  const { mutateAsync: updateNickname, isPending: updatingNickname } =
    useUpdateNickname();
  const { mutateAsync: updateLoginId, isPending: updatingLoginId } =
    useUpdateLoginId();

  const onNicknameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value),
    [],
  );
  const onUserIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value),
    [],
  );
  const onPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    [],
  );
  const onConfirmPwChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPw(e.target.value),
    [],
  );

  const startEditNickname = useCallback(() => setIsEditingNickname(true), []);
  const startEditLoginId = useCallback(() => setIsEditingUserId(true), []);
  const openPasswordEdit = useCallback(() => setIsEditingPassword(true), []);
  const closePasswordEdit = useCallback(() => setIsEditingPassword(false), []);

  const finishNickname = useCallback(async () => {
    if (!nicknameChanged) {
      setIsEditingNickname(false);
      return;
    }
    try {
      await updateNickname({ nickname: nickname.trim() });
      setIsEditingNickname(false);
      showToast('닉네임이 수정되었습니다.', 'success');
    } catch (e) {
      showToast(getErrorMessage(e, 'nickname'), 'error');
    }
  }, [nicknameChanged, updateNickname, nickname, showToast]);

  const finishLoginId = useCallback(async () => {
    if (!loginIdChanged) {
      setIsEditingUserId(false);
      return;
    }
    try {
      await updateLoginId({ loginId: userId.trim() });
      setIsEditingUserId(false);
      showToast('아이디가 수정되었습니다.', 'success');
    } catch (e) {
      showToast(getErrorMessage(e, 'loginId'), 'error');
    }
  }, [loginIdChanged, updateLoginId, userId, showToast]);

  const completePassword = useCallback(() => {
    closePasswordEdit();
    showToast('비밀번호가 수정되었습니다.', 'success');
  }, [closePasswordEdit, showToast]);

  return (
    <section className="flex flex-col gap-[2.4rem] px-[2.4rem] py-[4rem]">
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
                onChange={onNicknameChange}
                placeholder="새 닉네임 입력"
                disabled={!isEditingNickname || updatingNickname}
              />
            </div>
            <div className="flex-[1]">
              {isEditingNickname ? (
                <Button
                  className="w-full bg-brand-blue"
                  onClick={finishNickname}
                  disabled={!nickname.trim() || updatingNickname}
                >
                  {updatingNickname ? '저장중…' : '완료'}
                </Button>
              ) : (
                <Button
                  className="w-full bg-brand-blue"
                  onClick={startEditNickname}
                >
                  변경하기
                </Button>
              )}
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
                onChange={onUserIdChange}
                placeholder="새 아이디 입력"
                disabled={!isEditingUserId || updatingLoginId}
              />
            </div>
            <div className="flex-[1]">
              {isEditingUserId ? (
                <Button
                  className="w-full bg-brand-blue"
                  onClick={finishLoginId}
                  disabled={!userId.trim() || updatingLoginId}
                >
                  {updatingLoginId ? '저장중…' : '완료'}
                </Button>
              ) : (
                <Button
                  className="w-full bg-brand-blue"
                  onClick={startEditLoginId}
                >
                  변경하기
                </Button>
              )}
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
                  onChange={onPasswordChange}
                />
                <PasswordInput
                  placeholder="새 비밀번호 확인"
                  value={confirmPw}
                  onChange={onConfirmPwChange}
                />
                <Button className="bg-brand-blue" onClick={completePassword}>
                  완료
                </Button>
              </div>
            ) : (
              <Button
                id="change-password"
                className="w-full bg-brand-blue"
                onClick={openPasswordEdit}
              >
                비밀번호 변경하기
              </Button>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
