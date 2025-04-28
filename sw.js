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

// INSTALLAZIONE: salva i file statici nella cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ATTIVAZIONE: pulizia delle vecchie cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH: strategia "cache first, network fallback"
self.addEventListener('fetch', event => {
  const req = event.request;
  
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req)
      .then(cached => cached || fetch(req)
        .then(res => {
          // Aggiorna cache con nuove risposte
          return caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(req, res.clone());
              return res;
            });
        })
        .catch(() => caches.match('/index.html')) // fallback offline
      )
  );
});

// PUSH notifications
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
  
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Quando clicchi su notifica
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
