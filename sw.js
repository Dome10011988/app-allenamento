const CACHE_NAME = 'fit-tracker-v2';
const ASSETS = [
  '/index.html',
  '/programma-allenamento.html',
  '/piano-alimentare.html',
  '/lista-spesa-giornaliera.html',
  '/aggiungi-peso.html',
  '/risultati-allenamento.html',
  '/style.css',
  '/script.js',
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
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => 
      cached || fetch(req).then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(req, res.clone());
          return res;
        });
      })
    )
  );
});

// Gestione notifiche push (opzionale)
self.addEventListener('push', event => {
  const data = event.data?.json() || {
    title: 'Allenamento!',
    body: 'Non dimenticare il tuo workout di oggi! 💪',
    icon: '/kettlebell-preview.png'
  };
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.icon,
    data: { url: '/' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
