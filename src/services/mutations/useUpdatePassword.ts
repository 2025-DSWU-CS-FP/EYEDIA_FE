import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import client from '@/services/axiosInstance';

type UpdatePasswordPayload = { password: string; confirmPassword: string };

type ApiErrorBody = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: { updatePassWordRequest?: string };
};

type ApiBaseResponse = { isSuccess: boolean; code: string; message: string };

async function request(
  payload: UpdatePasswordPayload,
): Promise<ApiBaseResponse> {
  const res = await client.post<ApiBaseResponse>(
    '/api/v1/users/me/pw',
    payload,
  );
  return res.data;
}

export default function useUpdatePassword() {
  return useMutation<
    ApiBaseResponse,
    AxiosError<ApiErrorBody>,
    UpdatePasswordPayload
  >({
    mutationFn: request,
  });
}
