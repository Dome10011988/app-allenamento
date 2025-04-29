// sw.js

const CACHE_NAME = 'fit-tracker-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/programma-allenamento.html',
  '/piano-alimentare.html',
  '/lista-spesa-giornaliera.html',
  '/aggiungi-peso.html',
  '/risultati-allenamento.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/kettlebell-preview.png' // Immagine icona
];

// Installazione - Cache dei file principali
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching all assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Attivazione - Pulizia cache vecchia
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => {
      console.log('[Service Worker] Attivato e cache aggiornata');
      return self.clients.claim();
    })
  );
});

// Fetch - Risposte dalla cache oppure dal network
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Per navigazioni tra pagine
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
    // Per altre richieste (css, js, immagini)
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        }))
    );
  }
});

// Notifiche Push
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

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Click su Notifica
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
