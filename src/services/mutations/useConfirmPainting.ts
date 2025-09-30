import { useMutation } from '@tanstack/react-query';

import getAuthToken from '@/utils/getToken';

export type ConfirmPaintingResponse = { isSuccess: boolean; message?: string };

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export default function useConfirmPainting() {
  return useMutation<ConfirmPaintingResponse, Error, number>({
    mutationFn: async (paintingId: number) => {
      const token = getAuthToken();

      const res = await fetch(
        `${API_BASE}/api/v1/paintings/${paintingId}/confirm`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
          mode: 'cors',
          cache: 'no-store',
          keepalive: true,
        },
      );

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`confirm failed: ${res.status} ${text}`);
      }

      // eslint-disable-next-line no-console
      console.log('[confirm] fetch ok', paintingId);
      return { isSuccess: true };
    },
  });
}
