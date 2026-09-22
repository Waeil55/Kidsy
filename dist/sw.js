// Kidsy service worker: makes the app installable and lets it open with no internet connection.
// Everything a story or math problem needs is generated inside app.js, so caching the app shell
// (this page, its script and stylesheet, the icons) is enough for the whole app to work offline.
// Anything else — the AI voice, dictionary lookups, translations — is fetched fresh and simply
// falls back to a quieter mode when there is no connection, the same way it already does today.
const VERSION = 'kidsy-1790118688524';
const SHELL = ['./', './index.html', './app.css', './app.js', './pdf-worker.js', './manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let cross-origin requests (voice, dictionary, fonts) go straight to the network

  e.respondWith(
    caches.match(req).then((cached) => {
      const fresh = fetch(req)
        .then((res) => { if (res && res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone())); return res; })
        .catch(() => cached || caches.match('./index.html'));
      return cached || fresh;
    })
  );
});
