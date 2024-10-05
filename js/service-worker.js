const CACHE_NAME = 'crimson-cache-v4';
const urlsToCache = [
    // Pages HTML
    '../404.html',
    '../index.html',
    '../watch.html',
    '../tutoriel/anime.html',
    '../tutoriel/application.html',
    
    // Fichier CSS
    '../css/styles.css',
    
    // Fichiers JavaScript
    'js/script.js',
    
    // Images
    '../favicon/android-chrome-192x192.png',
    '../favicon/android-chrome-512x512.png',
    '../favicon/apple-touch-icon.png',
    '../favicon/favicon-16x16.png',
    '../favicon/favicon-32x32.png',
    '../favicon/favicon.ico',
    '../img/ajoute.jpeg',
    '../img/ajouter.jpeg',
    '../img/apli.jpeg',
    '../img/fleche.png',
    '../img/importer.jpeg',
    '../img/logo-iphone.png',
    '../img/logo.png',
    '../img/mega-app.jpeg',
    '../img/partager.jpeg',
    '../img/recherche.jpeg',
    '../img/regarder.jpeg',
    '../img/sur.jpeg',
    
    // Manifest PWA
    '../pwa/manifest.json',
    
    // Robots.txt pour les crawlers
    '../robots.txt',
    
    // Fichier Json
    '../films.json'
];

// Installation du service worker et mise en cache des fichiers
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Fichiers mis en cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activation du service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interception des requêtes réseau et récupération depuis le cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Fichier trouvé dans le cache
                }
                return fetch(event.request); // Fichier non trouvé, récupération réseau
            })
    );
});
