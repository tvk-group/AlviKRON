/**
 * alviKRON Community App — offline shell cache
 */
const CACHE = 'alvikron-app-v1';
const ASSETS = [
  '/app/',
  '/app/index.html',
  '/app/dashboard.html',
  '/app/manifest.webmanifest',
  '/assets/css/app.css',
  '/assets/js/app-config.js',
  '/assets/js/app-core.js',
  '/assets/js/app.js',
  '/assets/js/app-dashboard.js',
  '/assets/js/kron-data.js',
  '/assets/brand/icon.png',
  '/assets/brand/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/app/') && !url.pathname.startsWith('/assets/')) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      const fetchPromise = fetch(event.request).then(function (response) {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function () {
        return cached;
      });
      return cached || fetchPromise;
    })
  );
});
