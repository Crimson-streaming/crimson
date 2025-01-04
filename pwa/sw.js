const cacheName = 'crimson-cache-v1';
const staticAssets = [
    '../',
    '../index.html',
    '../404.html',
    '../css/style-three.css',
    '../css/bootstrap.min.css',
    '../css/megamenu.css',
    '../css/ionicons.css',
    '../css/font-awesome.min.css',
    '../css/responsive.css',
    '../css/splide.min.css',
    '../css/player-crimson.css',
    '../css/jquery-eu-cookie-law-popup.css',
    '../css/owl.carousel.min.css',
    '../css/validatesecurity.css',
    '../css/search.css',
    '../js/sweetalert2@11.js',
    '../js/jquery-3.3.1.min.js',
    '../js/jquery.easing.min.js',
    '../js/bootstrap.min.js',
    '../js/owl.carousel.min.js',
    '../js/jquery.nice-select.min.js',
    '../js/megamenu.js',
    '../js/splide.min.js',
    '../js/custom-main.js',
    '../js/jquery-eu-cookie-law-popup.js',
    '../img/favicon/favicon.png',
    '../img/logo.png',
    '../img/404.png',
    '../img/logo-mobile.png',
    '../pages/déinstallation.html', // Si vous avez cette page aussi à mettre en cache
    // Ajoutez d'autres fichiers nécessaires à votre site
];


// Installation du Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('Service Worker: Caching assets');
            return cache.addAll(staticAssets);
        })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (!cacheWhitelist.includes(cache)) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Récupération des fichiers
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                // Si la requête échoue, afficher la page 404 lorsque l'utilisateur est hors ligne
                return caches.match('../404.html');
            });
        })
    );
});
