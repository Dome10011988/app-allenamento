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

// Installazione e caching degli asset
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Gestione click sulle notifiche
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/index.html'));
});

// Strategia di fetch: cache first per navigazioni e asset
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

// ✅ Gestione notifiche push (base)
self.addEventListener('push', function(event) {
  const data = event.data?.json() || {
    title: 'Promemoria Allenamento!',
    body: 'È ora di allenarti! 💪',
    icon: '/kettlebell-preview.png'
  };

  const options = {
    body: data.body,
    icon: data.icon,
    badge: '/kettlebell-preview.png',
    data: {
      url: '/index.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
