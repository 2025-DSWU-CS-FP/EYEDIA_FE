export default async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

  reg.waiting?.postMessage({ type: 'SKIP_WAITING' });

  reg.addEventListener('updatefound', () => {
    const sw = reg.installing;
    if (!sw) return;
    sw.addEventListener('statechange', () => {
      if (sw.state === 'installed' && navigator.serviceWorker.controller) {
        sw.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
