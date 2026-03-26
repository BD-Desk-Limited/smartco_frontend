// Custom Service Worker for offline app-shell behavior.
// This keeps previously visited pages/assets usable when network is down.
const STATIC_CACHE_NAME = 'smartco-static-v2';
const PAGES_CACHE_NAME = 'smartco-pages-v2';
const RUNTIME_CACHE_NAME = 'smartco-runtime-v2';
const OFFLINE_URL = '/offline';

const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/icon512_maskable.png',
  '/icon512_rounded.png',
  '/pages/auth/login/sales-point',
  '/pages/account/sales-point',
];

const CACHEABLE_DESTINATIONS = new Set(['script', 'style', 'image', 'font']);

const isSameOrigin = (requestUrl) =>
  new URL(requestUrl).origin === self.location.origin;

const isCacheableResponse = (response) =>
  response && (response.ok || response.type === 'opaque');

const precacheAppShell = async () => {
  const cache = await caches.open(STATIC_CACHE_NAME);

  // Use allSettled so one missing route does not abort SW install.
  await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
};

const cacheFirst = async (request, cacheName) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (isCacheableResponse(networkResponse)) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return cachedResponse || Response.error();
  }
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cachedResponse = await caches.match(request);

  const networkPromise = fetch(request)
    .then(async (networkResponse) => {
      if (isCacheableResponse(networkResponse)) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await networkPromise;
  return networkResponse || Response.error();
};

const handleNavigationRequest = async (request) => {
  const pagesCache = await caches.open(PAGES_CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (isCacheableResponse(networkResponse)) {
      pagesCache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedPage = await pagesCache.match(request);
    if (cachedPage) return cachedPage;

    const cachedRoot = await caches.match('/');
    if (cachedRoot) return cachedRoot;

    const offlinePage = await caches.match(OFFLINE_URL);
    if (offlinePage) return offlinePage;

    return Response.error();
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(precacheAppShell());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (name) =>
                ![
                  STATIC_CACHE_NAME,
                  PAGES_CACHE_NAME,
                  RUNTIME_CACHE_NAME,
                ].includes(name)
            )
            .map((name) => caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;
  if (!isSameOrigin(request.url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  const url = new URL(request.url);
  const isNextStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image/');

  if (isNextStatic || CACHEABLE_DESTINATIONS.has(request.destination)) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE_NAME));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE_NAME));
});
