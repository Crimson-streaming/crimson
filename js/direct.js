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
        autoplay: true,
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
    const hlsSource = videoElement.querySelector('source').src;

    // Vérifie si HLS est pris en charge et n'est pas Safari
    if (Hls.isSupported() && !/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(videoElement);

        // Recharge la vidéo à la fin
        videoElement.addEventListener('ended', () => {
            hls.loadSource(hlsSource);
            videoElement.play(); // Relecture
        });

        // Gestion des erreurs de HLS
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log("Erreur réseau, tentative de récupération...");
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log("Erreur média, tentative de récupération...");
                        hls.recoverMediaError();
                        break;
                    default:
                        console.log("Erreur fatale, rechargement...");
                        hls.destroy();
                        hls.loadSource(hlsSource);
                        hls.attachMedia(videoElement);
                        break;
                }
            }
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Support natif HLS pour Safari
        videoElement.src = hlsSource;
        videoElement.addEventListener('ended', () => {
            videoElement.play(); // Relecture
        });
    } else {
        console.error('Le flux HLS n\'est pas supporté sur cet appareil.');
    }
});



async function showSuggestions(query) {
    const searchOutput = document.getElementById('search_output');
    searchOutput.innerHTML = ''; // Réinitialiser les résultats
  
    if (!query) return; // Si la requête est vide, ne rien faire
  
    try {
        const response = await fetch('../search/d.direct.json');
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