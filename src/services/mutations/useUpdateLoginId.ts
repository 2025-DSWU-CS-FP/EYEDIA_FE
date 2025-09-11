import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import client from '@/services/axiosInstance';

type UpdateLoginIdPayload = { loginId: string };
type ApiErrorBody = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: { nickname?: string; loginId?: string };
};

type ApiBaseResponse = { isSuccess: boolean; code: string; message: string };

async function request(
  payload: UpdateLoginIdPayload,
): Promise<ApiBaseResponse> {
  const res = await client.patch<ApiBaseResponse>(
    '/api/v1/users/me/login-id',
    payload,
  );
  return res.data;
}

export default function useUpdateLoginId() {
  return useMutation<
    ApiBaseResponse,
    AxiosError<ApiErrorBody>,
    UpdateLoginIdPayload
  >({
    mutationFn: request,
  });
}
