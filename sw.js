const CACHE_NAME = "robo-branco-v1";

const urlsToCache = [
  "/SEU-REPOSITORIO/",
  "/SEU-REPOSITORIO/index.html",
  "/SEU-REPOSITORIO/manifest.json",
  "/SEU-REPOSITORIO/icon-192.png",
  "/SEU-REPOSITORIO/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
