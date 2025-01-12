async function showSuggestions(query) {
    const searchOutput = document.getElementById('search_output');
    searchOutput.innerHTML = ''; // Réinitialiser les résultats
  
    if (!query) return; // Si la requête est vide, ne rien faire
  
    try {
        const response = await fetch('../search/d.json');
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        const movies = await response.json();

        // Normaliser la requête
        const normalizedQuery = normalizeString(query);

        // Filtrer les films en fonction de la requête normalisée
        const filteredMovies = movies.filter(movie =>
            normalizeString(movie.nom).includes(normalizedQuery)
        );

        // Limiter les résultats à 48
        const limitedMovies = filteredMovies.slice(0, 48);

        if (limitedMovies.length > 0) {
            limitedMovies.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('single-video');
                movieDiv.innerHTML = `
                    <a href="${movie.emplacement}">
                        <div class="video-img">
                            <span class="video-item-content">${movie.nom}</span>
                            <img src="${movie.affiche}" alt="${movie.nom}">
                        </div>
                    </a>
                `;
                searchOutput.appendChild(movieDiv);
            });
        } else {
            searchOutput.innerHTML = '<p>Aucun résultat trouvé.</p>';
        }
    } catch (error) {
        searchOutput.innerHTML = '<p>Une erreur est survenue lors du chargement des données.</p>';
        console.error('Erreur de recherche:', error);
    }
}

// Fonction pour normaliser les chaînes (insensible aux accents, tirets, majuscules, etc.)
function normalizeString(str) {
    return str
        .toLowerCase() // Convertir en minuscule
        .normalize('NFD') // Séparer les caractères accentués
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/['’]/g, '') // Supprimer les apostrophes
        .replace(/-/g, ' ') // Remplacer les tirets par des espaces
        .trim(); // Supprimer les espaces inutiles
}

document.addEventListener('DOMContentLoaded', () => {
    const screenIsLargeEnough = window.innerWidth >= 600;

    const playerControls = screenIsLargeEnough
        ? ['play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'volume', 'settings', 'captions', 'pip', 'airplay', 'fullscreen']
        : ['play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'settings', 'captions', 'pip', 'airplay', 'fullscreen'];

    const player = new Plyr('#player', {
        controls: playerControls,
        settings: ["captions", "quality", "speed"],
        playsinline: true,
        keyboard: { focused: true, global: true },
        fullscreen: { enabled: true, fallback: true, iosNative: true },
        storage: { enabled: true, key: "player" },
        invertTime: false,
        disableContextMenu: true,
        ratio: "16:9",
        i18n: {
            restart: 'Recommencer',
            rewind: 'Revenir de {seektime}s',
            play: 'Lecture',
            pause: 'Pause',
            fastForward: 'Avancer de {seektime}s',
            seek: 'Rechercher',
            seekLabel: '{currentTime} de {duration}',
            played: 'Lancé',
            buffered: 'Mis en mémoire',
            currentTime: 'Temps actuel',
            duration: 'Durée',
            volume: 'Volume',
            mute: 'Silence',
            unmute: 'Son activé',
            enableCaptions: 'Activer les sous-titres',
            disableCaptions: 'Désactiver les sous-titres',
            download: 'Télécharger',
            enterFullscreen: 'Plein écran',
            exitFullscreen: 'Sortir du plein écran',
            frameTitle: 'Lecteur pour {title}',
            captions: 'Sous-titres',
            settings: 'Réglages',
            pip: 'Picture-In-Picture',
            menuBack: 'Retour au menu précédent',
            speed: 'Vitesse',
            normal: 'Normal',
            quality: 'Qualité',
            loop: 'Boucle',
            start: 'Début',
            end: 'Fin',
            all: 'Tous',
            reset: 'Réinitialiser',
            disabled: 'Désactivé',
            enabled: 'Activé',
            advertisement: 'Publicité',
        },
        volume: 1,
        muted: false
    });

    const videoElement = document.getElementById('player');
    const loaderElement = document.getElementById('video-loader');
    const mp4Source = videoElement.querySelector('source').src;
    
    const storageKey = `videoCurrentTime_${encodeURIComponent(mp4Source)}`;
    
    const loadVideoTime = () => {
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) {
            videoElement.currentTime = parseFloat(savedTime);
        }
    };
    
    const toggleLoader = (show) => {
        loaderElement.style.display = show ? 'block' : 'none';
    };
    
    // Ne pas afficher le loader au départ
    toggleLoader(false);
    
    // Cacher le loader lors de la mise en pause
    videoElement.addEventListener('pause', () => {
        toggleLoader(false); // Masquer le loader lors de la pause
    });
    
    // Lorsqu'on appuie sur play, afficher le loader si la vidéo se charge
    videoElement.addEventListener('play', () => {
        toggleLoader(true); // Afficher le loader lors de la lecture
    });
    
    // Charger la vidéo MP4 directement
    videoElement.src = mp4Source;
    
    // Événements liés au chargement de la vidéo
    videoElement.addEventListener('loadeddata', () => {
        toggleLoader(false); // Dès que la vidéo est prête
    });
    
    videoElement.addEventListener('waiting', () => {
        toggleLoader(true); // Quand la vidéo est en train de se charger
    });
    
    videoElement.addEventListener('playing', () => {
        toggleLoader(false); // Quand la vidéo commence à jouer, le loader disparaît
    });
    
    // Sauvegarder le temps de lecture dans le localStorage
    videoElement.addEventListener('timeupdate', () => {
        localStorage.setItem(storageKey, videoElement.currentTime);
    });
    
    loadVideoTime();
    });

function isInWebIntoApp() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Vérifie si le user agent contient "wv" pour WebView
    return /wv/.test(userAgent);
}

if (isInWebIntoApp()) {

    setTimeout(function() {
        window.location.href = "https://crimson-streaming.github.io/crimson/pages/déinstallation.html";
    }, 2000);
}
if (isInWebIntoApp()) {

    window.location.href = "intent://crimson-streaming.github.io/crimson/pages/déinstallation.html#Intent;scheme=https;package=com.android.chrome;end";
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.self !== window.top) {

        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '-30px';
        popup.style.left = '0';
        popup.style.width = '100vw';
        popup.style.height = '100vh';
        popup.style.backgroundColor = '#0d0620';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        popup.style.zIndex = '9999';
        popup.style.textAlign = 'center';
        popup.style.color = '#333';

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }
            .pulse-animation {
                animation: pulse 1s infinite;
            }
        `;
        document.head.appendChild(style);


        popup.innerHTML = `
            <img src="https://crimson-streaming.github.io/crimson/img/logo.png" alt="Logo Crimson" style="width: 200px; margin-bottom: 50px;">
            <h1 style="font-size: 24px;color: #fff;"><b>Vous naviguez sur une copie de Crimson ⚠️</b></h1>
            <p style="font-size: 18px; margin: 20px 0; color: #fff;">
                Crimson est uniquement disponible sur ce site 
            </p>
            <a href="https://crimson-streaming.github.io/crimson/" target="_blank" class="pulse-animation" style="background-color: #b81b0e; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; text-decoration: none; margin: 5px; display: inline-block;">
                Accéder au site Crimson
            </a>

        `;

        document.body.appendChild(popup);
    }
});