export default function getAuthToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const fromSession = sessionStorage.getItem('accessToken');
  const fromLocal = localStorage.getItem('accessToken');
  return fromSession || fromLocal || undefined;
}
