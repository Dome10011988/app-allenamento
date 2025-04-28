const CACHE_NAME = 'app-allenamento-' + Date.now();

self.addEventListener('install', event => {
  self.skipWaiting(); // Subito attivo
});

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

// Salva dinamicamente le risorse
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Rispondi dalla cache
      }
      return fetch(event.request).then(networkResponse => {
        if (event.request.method === 'GET' && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      }).catch(() => caches.match('/index.html')); // fallback offline
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
