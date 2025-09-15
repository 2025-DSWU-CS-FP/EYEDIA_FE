import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import client from '@/services/axiosInstance';

type UpdateNicknamePayload = { nickname: string };
type ApiErrorBody = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: { nickname?: string; loginId?: string };
};

type ApiBaseResponse = { isSuccess: boolean; code: string; message: string };

async function request(
  payload: UpdateNicknamePayload,
): Promise<ApiBaseResponse> {
  const res = await client.patch<ApiBaseResponse>(
    '/api/v1/users/me/nickname',
    payload,
  );
  return res.data;
}

export default function useUpdateNickname() {
  return useMutation<
    ApiBaseResponse,
    AxiosError<ApiErrorBody>,
    UpdateNicknamePayload
  >({
    mutationFn: request,
  });
}
