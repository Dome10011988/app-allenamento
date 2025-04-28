const CACHE_NAME = 'fit-tracker-v2';
const ASSETS = [
  '/index.html',
  '/programma-allenamento.html',
  '/piano-alimentare.html',
  '/lista-spesa-giornaliera.html',
  '/aggiungi-peso.html',
  '/risultati-allenamento.html',
  '/app.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/kettlebell-preview.png'
];

// Installazione: salva in cache tutti gli asset essenziali
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Attivazione: cancella vecchie cache se presenti
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

// Fetch: serve contenuti da cache, se non trovati, scarica e aggiorna
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // ignora POST ecc
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request)
        .then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

// Push Notifications (se vorrai attivarle)
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

// Click sulla notifica
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
