// CISM QAE service worker — cache-first for full offline use.
// Bump CACHE version when you replace index.html to force clients to update.
const CACHE = 'cism-qae-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never cache API calls (Anthropic / jsonbin) — always go to network.
  if (url.hostname === 'api.anthropic.com' || url.hostname === 'api.jsonbin.io') {
    return; // let the browser handle it normally
  }
  // App shell: cache-first, fall back to network, then to cached index for navigations.
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached || fetch(e.request).catch(() => caches.match('./index.html'))
    )
  );
});
