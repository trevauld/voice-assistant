const CACHE_NAME = 'voice-assistant-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './translations.js',
  './manifest.json'
];

// Install Event: Cache core files and skip waiting to force update
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate Event: Clear out any old caches and immediately take control of the app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-First strategy
self.addEventListener('fetch', event => {
  // Only handle GET requests (ignore API POSTs to Deepgram/ElevenLabs)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If network fetch succeeds, update the local cache silently
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If offline, serve from cache
        return caches.match(event.request);
      })
  );
});
