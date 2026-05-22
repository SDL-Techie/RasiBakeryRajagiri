const CACHE_NAME = 'rasi-bakery-v1';

// Listen for installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/index.html']);
    })
  );
});

// Control the page immediately upon activation
self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// Intercept network requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});