import { useMutation, useQueryClient } from '@tanstack/react-query';

import getAuthToken from '@/utils/getToken';

type BaseResponse<T = unknown> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

const API_BASE = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
).replace(/\/+$/, '');

async function deletePaintingRequest(): Promise<BaseResponse<unknown>> {
  if (!API_BASE) throw new Error('API_BASE가 설정되지 않았습니다.');

  const token = getAuthToken();
  if (!token) throw new Error('인증 토큰이 없습니다.');

  const res = await fetch(`${API_BASE}/api/v1/paintings`, {
    method: 'DELETE',
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
  });

  const ct = res.headers.get('content-type') ?? '';
  if (!res.ok) {
    const msg = ct.includes('application/json')
      ? (((await res.json()) as Partial<BaseResponse>).message ?? '')
      : (await res.text().catch(() => '')) || '';
    throw new Error(msg || '작품 삭제 요청이 실패했습니다.');
  }

  if (ct.includes('application/json')) {
    return (await res.json()) as BaseResponse<unknown>;
  }
  return {
    isSuccess: true,
    code: 'OK',
    message: '삭제되었습니다.',
    result: {},
  };
}

export default function useDeletePainting() {
  const qc = useQueryClient();
  return useMutation<BaseResponse<unknown>, Error, void>({
    mutationFn: deletePaintingRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['paintings', 'list'] });
    },
  });
}
