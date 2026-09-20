// MerolaApp Production Service Worker - Resilient Offline Caching
const CACHE_NAME = 'merolaapp-v8-huge-modern-sayit';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg'
];

// Install: pre-cache shell and skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up ALL old caches immediately and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch handler: Network-first for HTML navigations, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // 1. Navigation requests (HTML document): Network-First so users always get the latest build
  // CRITICAL: If network returns 404 on PWA launch or sub-path, fallback to cached index.html!
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            return networkRes;
          }
          // If GitHub Pages returns 404, deliver cached app shell!
          return caches.match('./index.html').then((cachedHtml) => {
            if (cachedHtml) return cachedHtml;
            return caches.match('./').then((rootRes) => rootRes || networkRes);
          });
        })
        .catch(() => {
          return caches.match('./index.html').then((cachedHtml) => {
            if (cachedHtml) return cachedHtml;
            return caches.match('./');
          });
        })
    );
    return;
  }

  // 2. Static assets (JS, CSS, SVGs, Fonts): Stale-while-revalidate or Cache-first
  // IMPORTANT: NEVER return index.html for failed JS/CSS requests!
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      if (cachedRes) return cachedRes;

      return fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return networkRes;
      });
    })
  );
});
