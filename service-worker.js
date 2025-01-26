const versionCache = "cache-v1.0";

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        (async () => {
            const cache = await caches.open(versionCache);
            if (cache) {
                // Ajout correct de la ressource au cache
                await cache.addAll([
                    "https://crimson-streaming.github.io/crimson/offline.html"
                ]);
            }
        })()
    );
});

self.addEventListener('activate', () => {
    clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }
                    return await fetch(event.request);
                } catch (e) {
                    const cache = await caches.open(versionCache);
                    const cachedResponse = await cache.match(
                        "https://crimson-streaming.github.io/crimson/offline.html"
                    );
                    return cachedResponse || Response.error();
                }
            })()
        );
    }
});