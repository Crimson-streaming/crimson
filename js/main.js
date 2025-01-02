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
    const playerControls = ['play-large' ,'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'volume', 'captions', 'pip', 'airplay', 'settings', 'fullscreen', 'cast'];
    const player = new Plyr('#player', {
        controls: playerControls,
        quality: {
            default: 720,
            options: [720]
        },
        playsinline: true,
        keyboard: { focused: true, global: true },
        fullscreen: { enabled: true, fallback: true, iosNative: true },
        disableContextMenu: true,
        i18n: {
              restart: 'Recommencer',
    rewind: 'Revenir de {seektime}s',
    play: 'Play',
    pause: 'Pause',
    fastForward: 'Passer {seektime}s',
    seek: 'Rechercher',
    seekLabel: '{currentTime} de {duration}',
    played: 'Lancé',
    buffered: 'Buffered',
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
    });

    const videoElement = document.getElementById('player');
    const hlsSource = videoElement.querySelector('source').src;

    
    
    // Utiliser l'URL comme clé unique pour la vidéo
    const storageKey = `videoCurrentTime_${encodeURIComponent(hlsSource)}`;
    
    // Charger le temps de lecture
    const loadVideoTime = () => {
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) {
            videoElement.currentTime = parseFloat(savedTime);
        }
    };
    
    // Précharger la vidéo avant la lecture pour réduire le délai de démarrage
    const preloadVideo = () => {
        videoElement.load();
    };
    
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(videoElement);
    
        // Gestion des erreurs HLS
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.error('Erreur HLS:', data);
                // Vous pouvez également mettre en place une gestion de repli ici
            }
        });
    
        videoElement.addEventListener('ended', () => {
            hls.loadSource(hlsSource);
            videoElement.play(); // Replay video
        });
    
        // Sauvegarder le temps de lecture
        videoElement.addEventListener('timeupdate', () => {
            localStorage.setItem(storageKey, videoElement.currentTime);
        });
    
        // Précharger la vidéo
        preloadVideo();
    
        loadVideoTime(); // Charger le temps de lecture à la fin de la configuration
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for native HLS support (Safari)
        videoElement.src = hlsSource;
    
        // Gestion des erreurs de lecture vidéo
        videoElement.onerror = () => {
            console.error('Erreur de lecture vidéo');
            // Vous pouvez ici mettre en place une gestion de l'erreur ou un repli
        };
    
        videoElement.addEventListener('ended', () => {
            videoElement.play(); // Replay video
        });
    
        // Précharger la vidéo pour les navigateurs avec prise en charge native HLS
        preloadVideo();
    
        loadVideoTime(); // Charger le temps de lecture à la fin de la configuration
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
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
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
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const removedItem = watchlist.splice(index, 1); // Supprime l'élément
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







