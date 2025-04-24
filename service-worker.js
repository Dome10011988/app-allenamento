const CACHE_NAME = 'app-allenamento-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/programma-allenamento.html',
  '/piano-alimentare.html',
  '/lista-spesa-giornaliera.html',
  '/aggiungi-peso.html',
  '/kettlebell-preview.png',
  '/service-worker/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => caches.open(CACHE_NAME).then(cache => {
          cache.put(req, res.clone());
          return res;
        }))
        .catch(() => caches.match('/'))
    );
  } else {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(req, res.clone());
          return res;
        });
      }))
    );
  }
});
