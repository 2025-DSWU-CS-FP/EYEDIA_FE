import getAuthToken from '@/utils/getToken';

export type AskResponse = {
  artId: number;
  answer: string;
  model?: string;
};

type AskWithArtId = { paintingId: number; text: string };
type AskWithPaintingId = { paintingId: number; text: string };

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export function askArtworkLLM(
  req: AskWithArtId,
  signal?: AbortSignal,
): Promise<AskResponse>;
export function askArtworkLLM(
  req: AskWithPaintingId,
  signal?: AbortSignal,
): Promise<AskResponse>;

export async function askArtworkLLM(
  req: AskWithArtId | AskWithPaintingId,
  signal?: AbortSignal,
): Promise<AskResponse> {
  const payload: AskWithArtId =
    'artId' in req ? req : { paintingId: req.paintingId, text: req.text };

  try {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/api/v1/chats/ask`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal,
      cache: 'no-store',
      keepalive: true,
      credentials: 'include',
      mode: 'cors',
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`ask failed: ${res.status} ${body}`);
    }

    return (await res.json()) as AskResponse;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw e;
    }
    throw e;
  }
}
