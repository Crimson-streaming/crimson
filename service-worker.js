const versionCache = "cache-v1.0";

self.addEventListener('install', (event) => {
    // Force l'activation immédiate du service worker
    self.skipWaiting();
    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(versionCache);
                if (cache) {
                    // Ajout correct de toutes les ressources nécessaires au cache
                    await cache.addAll([
                        "https://crimson-streaming.github.io/crimson/offline.html",
                        "https://crimson-streaming.github.io/crimson/css/bootstrap.min.css",
                        "https://crimson-streaming.github.io/crimson/css/style-three.css",
                        "https://fonts.googleapis.com/css?family=Nunito:300,400,600,700,800&display=swap",
                        "https://crimson-streaming.github.io/crimson/img/favicon/favicon.png"
                    ]);
                }
            } catch (error) {
                console.error("Échec de l'ajout des ressources au cache :", error);
            }
        })()
    );
});

self.addEventListener('activate', (event) => {
    // Supprime les anciens caches s'ils existent
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== versionCache) {
                        console.log("Suppression de l'ancien cache :", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })()
    );

    // Réclame le contrôle des clients immédiatement
    clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Gestion des requêtes de navigation
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }
                    return await fetch(event.request);
                } catch (error) {
                    console.warn("Échec du fetch, utilisation du cache :", error);
                    const cache = await caches.open(versionCache);
                    const cachedResponse = await cache.match(
                        "https://crimson-streaming.github.io/crimson/offline.html"
                    );
                    return cachedResponse || new Response("Erreur réseau", { status: 503 });
                }
            })()
        );
    } else {
        // Gestion des autres types de requêtes (CSS, JS, images, etc.)
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).catch((error) => {
                    console.warn("Échec du fetch pour :", event.request.url, error);
                    return new Response("Erreur réseau", { status: 503 });
                });
            })
        );
    }
});
