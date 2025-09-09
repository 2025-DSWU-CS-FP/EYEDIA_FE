const APP_CACHE = 'app-v1';
const ASSETS_CACHE = 'assets-v1';
const IMAGES_CACHE = 'images-v1';
const CORE = ['/offline.html'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(CORE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(k => ![APP_CACHE, ASSETS_CACHE, IMAGES_CACHE].includes(k))
          .map(k => caches.delete(k)),
      );
      if ('navigationPreload' in self.registration) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {}
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    if (/^\/api\//.test(url.pathname)) return;
    e.respondWith(handleNavigate(req));
    return;
  }

  if (url.origin === location.origin && /^\/assets\//.test(url.pathname)) {
    e.respondWith(staleWhileRevalidate(req, ASSETS_CACHE));
    return;
  }

  if (req.destination === 'image') {
    e.respondWith(cacheFirst(req, IMAGES_CACHE));
    return;
  }
});

async function handleNavigate(req) {
  try {
    const preload = await self.registration.navigationPreload?.getState?.();
    if (preload && preload.enabled) {
      const r = await ePreloadResponse();
      if (r) return r;
    }
    const net = await fetch(req);
    return net;
  } catch {
    const hit = await caches.match(req);
    if (hit) return hit;
    return caches.match('/offline.html');
  }
}

function ePreloadResponse() {
  return new Promise(resolve => {
    resolve(self.registration.navigationPreload?.getState ? null : null);
  });
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const fetchPromise = fetch(req)
    .then(res => {
      cache.put(req, res.clone());
      return res;
    })
    .catch(() => null);
  return hit || (await fetchPromise) || caches.match('/offline.html');
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch {
    return caches.match('/offline.html');
  }
}
