import { useMutation } from '@tanstack/react-query';

import getAuthToken from '@/utils/getToken';

const API_BASE = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
).replace(/\/+$/, '');

async function deletePaintingRequest(paintingId: number): Promise<void> {
  if (!API_BASE) throw new Error('API_BASE가 설정되지 않았습니다.');
  const token = getAuthToken();
  if (!token) throw new Error('인증 토큰이 없습니다.');
  const res = await fetch(`${API_BASE}/api/v1/paintings/${paintingId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || '작품 삭제 요청이 실패했습니다.');
  }
}

export default function useDeletePainting() {
  return useMutation({
    mutationFn: (paintingId: number) => deletePaintingRequest(paintingId),
  });
}
