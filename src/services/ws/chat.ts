export type AskRequest = {
  artId: number;
  text: string;
};

export type AskResponse = {
  artId: number;
  answer: string;
  model?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export async function askArtworkLLM(
  req: AskRequest,
  signal?: AbortSignal,
): Promise<AskResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/chats/ask`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(req),
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
      // 호출측에서 조용히 무시할 수 있도록 별도 메시지
      throw e;
    }
    throw e;
  }
}
