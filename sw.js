const CACHE_NAME = 'form-function-calculator-v1';
const APP_FILES = [
  './',
  './index.html',
  './style.css',
  './calculator.js',
  './manifest.json',
  './app-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName.startsWith('form-function-calculator-') && cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => cachedResponse || fetch(request).catch((error) => {
      if (request.mode === 'navigate') return caches.match('./index.html');
      throw error;
    }))
  );
});
