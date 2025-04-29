// sw.js

const CACHE_NAME = 'fit-tracker-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/programma-allenamento.html',
  '/piano-alimentare.html',
  '/lista-spesa-giornaliera.html',
  '/aggiungi-peso.html',
  '/risultati-allenamento.html',
  '/manifest.json',
  '/style.css',
  '/script.js',
  '/kettlebell-preview.png' // icona esempio
];

// Installazione
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Attivazione (pulizia vecchie cache)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Gestione fetch (offline fallback)
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});

// Notifiche Push (facoltativo)
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'Allenati ora!', body: 'Non dimenticare il tuo workout 💪' };
  const options = {
    body: data.body,
    icon: '/kettlebell-preview.png',
    badge: '/kettlebell-preview.png',
    data: { url: '/' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Clic su notifica
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
