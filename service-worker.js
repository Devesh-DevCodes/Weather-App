const CACHE_NAME = 'weather-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/service-worker.js',

    '/assets/favicon_io/android-chrome-192x192.png',
    '/assets/favicon_io/android-chrome-512x512.png',
    '/assets/favicon_io/apple-touch-icon.png',
    '/assets/favicon_io/favicon-32x32.png',
    '/assets/favicon_io/favicon-16x16.png',
    '/assets/favicon_io/favicon.ico',
    '/assets/app-icn.png',
    '/assets/app-icn1.png',
    '/assets/cloudy.png',
    '/assets/cloud.png',
    '/assets/fog.png',
    '/assets/night-cloudy.png',
    '/assets/rain.png',
    '/assets/rainy.png',
    '/assets/snow.png',
    '/assets/sunny.png',
    '/assets/thunder.png',
    '/offline.html',

];

// Install event: cache essential files
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache =>{
                console.log('Opened cache');
                return cache.addAll(urlsToCache)
            } 
        )
    );
});

// Fetch event: Intercepts requests and serves cached files when offline 
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin === 'https://api.openweathermap.org') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Only cache valid responses
          if (response && response.ok) {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
              return response;
            });
          }
          return response; // just return if not ok
        })
        .catch(() => caches.match(event.request)) // fallback to cache
    );
    return;
  }

  // Default static file cache
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     fetch(event.request).catch(() => caches.match('/offline.html'))
//   );
// });


// Activate event: Cleans up old caches when the service worker is updated
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      Promise.all([
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (!cacheWhitelist.includes(cacheName)) {
                return caches.delete(cacheName);
              }
            })
          );
        }),
        self.clients.claim() 
      ])
    );
});
