import { useMutation } from '@tanstack/react-query';

import getAuthToken from '@/utils/getToken';

export type ConfirmPaintingResponse = { isSuccess: boolean };

export type ConfirmPaintingConflictResult = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    history: number[];
    newChatroom: number;
  };
};

export class ConfirmPaintingError extends Error {
  status: number;

  payload: ConfirmPaintingConflictResult;

  constructor(status: number, payload: ConfirmPaintingConflictResult) {
    super(payload.message);
    this.name = 'ConfirmPaintingError';
    this.status = status;
    this.payload = payload;
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export default function useConfirmPainting() {
  return useMutation<
    ConfirmPaintingResponse,
    Error | ConfirmPaintingError,
    number
  >({
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

      if (res.ok) {
        return { isSuccess: true };
      }

      const text = await res.text().catch(() => '');

      if (res.status === 409 && text) {
        let parsed: ConfirmPaintingConflictResult | null = null;

        try {
          parsed = JSON.parse(text) as ConfirmPaintingConflictResult;
        } catch {
          parsed = null;
        }

        if (parsed && parsed.code === 'PAINTING409') {
          throw new ConfirmPaintingError(res.status, parsed);
        }
      }

      throw new Error(`confirm failed: ${res.status} ${text}`);
    },
  });
}
