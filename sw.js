const CACHE_NAME = 'app-allenamento-' + Date.now(); // Cache sempre unica!

const ASSETS = [
  '/index.html',
  '/aggiungi-peso.html',
  '/piano-alimentare.html',
  '/programma-allenamento.html',
  '/lista-spesa-giornaliera.html',
  '/allenamenti-risultati.html',
  '/script.js',
  '/style.css',
  '/manifest.json',
  '/kettlebell-preview.png'
];

// Installa e pre-cacha i file
self.addEventListener('install', event => {
  self.skipWaiting(); // forza subito l'attivazione
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Pulizia vecchie cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Gestione fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});

// Push notification
self.addEventListener('push', event => {
  const data = event.data?.json() || {
    title: 'Promemoria Allenamento',
    body: 'È ora di allenarti! 💪',
    icon: '/kettlebell-preview.png'
  };
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.icon,
    data: { url: '/index.html' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
