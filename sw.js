const CACHE_NAME = 'app-allenamento-v1';
const ASSETS = [
  '/index.html',
  '/aggiungi-peso.html',
  '/piano-alimentare.html',
  '/programma-allenamento.html',
  '/lista-spesa-giornaliera.html',
  '/script.js',
  '/style.css',
  '/manifest.json',
  '/kettlebell-preview.png'
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
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(req).then(cached =>
        cached || fetch(req).then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
      )
    );
  }
});

// Gestione push notifications
self.addEventListener('push', event => {
  const data = event.data?.json() || {
    title: 'Promemoria Allenamento',
    body: 'È ora di allenarti! 💪',
    icon: '/kettlebell-preview.png'
  };
  const options = { body: data.body, icon: data.icon, badge: data.icon, data: { url: '/index.html' } };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
