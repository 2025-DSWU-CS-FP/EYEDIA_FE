export const FALLBACK_IMG =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

export function ensureImage(url?: string | null): string {
  const u = (url ?? '').trim();
  return u.length > 0 ? u : FALLBACK_IMG;
}
