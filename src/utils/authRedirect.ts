let redirecting = false;

export default function redirectToLogin() {
  if (redirecting) return;
  redirecting = true;

  const { pathname, search, hash } = window.location;
  if (pathname.startsWith('/login')) return;

  const next = encodeURIComponent(`${pathname}${search}${hash}`);
  window.location.replace(`/login?next=${next}`);
}
