const CACHE_NAME = 'app-allenamento-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/programma-allenamento.html',
  '/piano-alimentare.html',
  '/lista-spesa-giornaliera.html',
  '/aggiungi-peso.html',
  '/icons/kettlebell-preview.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => caches.open(CACHE_NAME)
          .then(cache => { cache.put(req, res.clone()); return res; }))
        .catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req)
        .then(res => caches.open(CACHE_NAME)
          .then(cache => { cache.put(req, res.clone()); return res; }))
      )
    );
  }
});
