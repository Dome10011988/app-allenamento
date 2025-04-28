const CACHE_NAME = 'fit-tracker-v2';
const ASSETS = [
  '/index.html',
  '/programma-allenamento.html',
  '/piano-alimentare.html',
  '/lista-spesa-giornaliera.html',
  '/aggiungi-peso.html',
  '/risultati-allenamento.html',
  '/app.html',
  '/script.js',
  '/style.css',
  '/manifest.json',
  '/kettlebell-preview.png'
];

// Installazione: precache degli asset
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installazione');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Attivazione: elimina vecchie cache
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Attivazione');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: carica da cache prima, altrimenti dalla rete
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response; // Se in cache, ritorna
        return fetch(event.request)      // Altrimenti va online
          .then(res => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, res.clone());
              return res;
            });
          })
          .catch(() => caches.match('/index.html')); // Offline fallback
      })
  );
});

// Push Notifications (se vuoi implementarle)
self.addEventListener('push', event => {
  const data = event.data?.json() || {
    title: 'Promemoria Fit Tracker',
    body: 'Non dimenticare di aggiornare i tuoi dati!',
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
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
