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
    const hlsSource = videoElement.querySelector('source').src;

    const storageKey = `videoCurrentTime_${encodeURIComponent(hlsSource)}`;

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

    // Charger la vidéo via HLS
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => toggleLoader(false));
        hls.on(Hls.Events.BUFFER_STALLED, () => toggleLoader(true));

        videoElement.addEventListener('timeupdate', () => {
            localStorage.setItem(storageKey, videoElement.currentTime);
        });

        videoElement.addEventListener('waiting', () => toggleLoader(true)); // Quand la vidéo est en train de se charger
        videoElement.addEventListener('playing', () => toggleLoader(false)); // Quand la vidéo commence à jouer, le loader disparaît

        loadVideoTime();
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = hlsSource;

        videoElement.addEventListener('loadeddata', () => toggleLoader(false)); // Dès que la vidéo est prête
        videoElement.addEventListener('waiting', () => toggleLoader(true)); // Quand la vidéo est en train de se charger
        videoElement.addEventListener('timeupdate', () => {
            localStorage.setItem(storageKey, videoElement.currentTime);
        });

        loadVideoTime();
    } else {
        console.error('HLS non supporté, ou aucun fallback compatible disponible.');
        toggleLoader(false); // Masquer le loader en cas d'erreur
    }
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

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-7QZGKN17QX');

//list.html js 

const itemsPerPage = 48; // Nombre de films par page
let currentPage = 1; // Page actuelle

// Fonction pour charger les films depuis le localStorage
function loadWatchlist() {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist.reverse(); // Inverse l'ordre pour afficher les nouveaux films en premier
    renderFilms(watchlist, currentPage);
    renderPagination(watchlist);
}


// Afficher les films pour une page donnée
function renderFilms(watchlist, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const moviesToShow = watchlist.slice(startIndex, endIndex);

    const container = document.getElementById("movies-container");
    container.innerHTML = ""; // Réinitialise le contenu

    if (moviesToShow.length > 0) {
        moviesToShow.forEach((movie, index) => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('col-lg-2', 'col-md-3', 'col-sm-4', 'col-xs-12', 'col-6', 'single-video');
            movieDiv.innerHTML = `
                <div class="watchlist-item">
                    <a href="#" title="Remove" onclick="removeFromWatchlist(${startIndex + index})">
                        <i class="fa fa-times"></i> Retirer
                    </a>
                </div>
                <a href="${movie.emplacement}" title="${movie.nom}">
                    <div class="video-img">
                        <span class="video-item-content">${movie.nom}</span>
                        <img src="${movie.affiche}" alt="${movie.nom}" title="${movie.nom}">
                    </div>
                </a>
            `;
            container.appendChild(movieDiv);
        });
    } else {
        container.innerHTML = "<p>Aucun film dans votre liste pour le moment.</p>";
    }
}

// Gérer les liens de pagination avec un maximum de 11 pages visibles
function renderPagination(watchlist) {
    const totalPages = Math.ceil(watchlist.length / itemsPerPage);
    const paginationContainer = document.getElementById("pagination-links");
    paginationContainer.innerHTML = ""; // Vider les liens de pagination

    const maxVisiblePages = 11; // Nombre maximum de pages affichées
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajuster si on est au début ou à la fin
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (totalPages > 1) {
        // Bouton précédent
        paginationContainer.innerHTML += `
            <li class="${currentPage === 1 ? "disabled" : ""}">
                <a class="prev page-numbers" href="#" onclick="changePage(${currentPage - 1})"><i class="fa fa-caret-left"></i></a>
            </li>
        `;

        // Liens des pages
        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.innerHTML += `
                <li class="${i === currentPage ? "active" : ""}">
                    <a class="page-numbers" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }

        // Bouton suivant
        paginationContainer.innerHTML += `
            <li class="${currentPage === totalPages ? "disabled" : ""}">
                <a class="next page-numbers" href="#" onclick="changePage(${currentPage + 1})"><i class="fa fa-caret-right"></i></a>
            </li>
        `;
    }
}

// Changer de page
function changePage(page) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const totalPages = Math.ceil(watchlist.length / itemsPerPage);
    if (page < 1 || page > totalPages) return; // Vérifie les limites

    currentPage = page;
    renderFilms(watchlist, currentPage);
    renderPagination(watchlist);
}

function showCustomAlert(message) {
    // Création de l'élément d'alerte
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('custom-alert');

    // Ajout du contenu de l'alerte (icône + message)
    alertDiv.innerHTML = `
        <img src="img/assets/icon-sweetalert.png" alt="Success" class="icon">
        ${message}
    `;

    // Ajout de l'alerte au corps de la page
    document.body.appendChild(alertDiv);

    // Suppression de l'alerte après 3 secondes
    setTimeout(() => {
        alertDiv.remove();
    }, 3000); // Temps en millisecondes
}

// Exemple d'utilisation après la suppression d'un film
function removeFromWatchlist(index) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    // Recalcul de l'indice réel en fonction de l'inversion
    const actualIndex = watchlist.length - 1 - index;
    
    // Supprime l'élément à l'indice recalculé
    const removedItem = watchlist.splice(actualIndex, 1); 
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    
    loadWatchlist(); // Recharge la liste mise à jour

    // Affiche l'alerte
    showCustomAlert('Supprimé avec succès de votre liste');
}



// Charger la watchlist au chargement de la page
window.onload = loadWatchlist;





//list boutton js 


  function toggleWatchlist(element, nom, affiche, emplacement) {
      const movie = { nom, affiche, emplacement };
      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

      // Vérifie si le film est déjà dans la liste
      const movieIndex = watchlist.findIndex(item => item.nom === nom);

      if (movieIndex === -1) {
          // Ajouter à la liste
          watchlist.push(movie);
          localStorage.setItem("watchlist", JSON.stringify(watchlist));
          element.innerHTML = '<i class="fa fa-check"></i>‎ Supprimer de ma liste';
          element.onclick = () => toggleWatchlist(element, nom, affiche, emplacement);
      } else {
          // Supprimer de la liste
          watchlist.splice(movieIndex, 1);
          localStorage.setItem("watchlist", JSON.stringify(watchlist));
          element.innerHTML = '<i class="fa fa-plus"></i>‎ Ajouter à ma liste';
          element.onclick = () => toggleWatchlist(element, nom, affiche, emplacement);
      }
  }

	// Fonction exécutée lors de l'utilisation du clic droit.
	$(document).bind("contextmenu", function() {
		// On indique au navigateur de ne pas réagir en cas de clic droit.
		return false;
	});
	$(document).ready(function () {
    $(".video-shows-carousel").owlCarousel({
        loop: false,  // Pas de défilement infini
        margin: 10,   // Espacement entre les éléments
        nav: true,    // Affichage des flèches de navigation
        dots: true,   // Affichage des points de navigation
        navText: [
            "<i class='fas fa-angle-left'></i>", 
            "<i class='fas fa-angle-right'></i>"
        ],
        responsive: {
            0: {       // Pour les petits écrans
                items: 1
            },
            600: {     // Pour les écrans moyens
                items: 2
            },
            1000: {    // Pour les écrans larges
                items: ""
            }
        }
    });
});

// Récupération des éléments
const video = document.getElementById('player'); 
const ambilight = document.getElementById('ambilight');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let animationFrameId = null;

/**
 * Calcul de la couleur moyenne de l'image
 * @param {ImageData} frame - Les données de l'image capturée
 * @returns {Object} Couleur moyenne { r, g, b }
 */
const calculateAverageColor = (frame) => {
    const length = frame.data.length;
    let r = 0, g = 0, b = 0;

    for (let i = 0; i < length; i += 4) {
        r += frame.data[i];       // Rouge
        g += frame.data[i + 1];   // Vert
        b += frame.data[i + 2];   // Bleu
    }

    const pixels = length / 4; // Nombre total de pixels
    return {
        r: Math.floor(r / pixels),
        g: Math.floor(g / pixels),
        b: Math.floor(b / pixels)
    };
};

/**
 * Met à jour l'effet Ambilight
 */
const updateAmbilight = () => {
    if (!video.paused && !video.ended) {
        // Ajuste la hauteur du conteneur Ambilight à celle de la vidéo
        ambilight.style.height = `${video.offsetHeight}px`;

        // Réduit la résolution pour améliorer les performances
        canvas.width = video.videoWidth / 8;
        canvas.height = video.videoHeight / 8;

        // Dessine l'image de la vidéo sur le canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Récupère les données d'image
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { r, g, b } = calculateAverageColor(frame);

        // Applique un dégradé radial basé sur la couleur moyenne
        ambilight.style.background = `radial-gradient(circle, rgba(${r},${g},${b},0.8) 50%, transparent 100%)`;

        // Planifie la prochaine mise à jour
        animationFrameId = requestAnimationFrame(updateAmbilight);
    }
};

/**
 * Démarre l'effet Ambilight
 */
const startAmbilight = () => {
    if (!animationFrameId) {
        updateAmbilight();
    }
};

/**
 * Arrête l'effet Ambilight
 */
const stopAmbilight = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
};

// Ajout des événements au lecteur vidéo
video.addEventListener('play', startAmbilight);
video.addEventListener('pause', stopAmbilight);
video.addEventListener('ended', stopAmbilight);
