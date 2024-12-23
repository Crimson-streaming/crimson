// Fonction pour ajouter un film à la liste des films récemment visionnés
function addMovieToTrending() {
    const posterDiv = document.getElementById('poster-watch-movie');
    if (!posterDiv) return; // Ne rien faire si l'élément n'existe pas

    const posterStyle = posterDiv.style.backgroundImage;
    const posterUrlMatch = posterStyle.match(/url\((['"]?)(.*?)\1\)/);
    if (!posterUrlMatch) return; // Ne rien faire si le poster est introuvable
    const posterUrl = posterUrlMatch[2];

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) return; // Ne rien faire si le lien canonique n'existe pas
    const moviePath = 'film/' + canonicalLink.getAttribute('href');

    const movie = {
        poster: posterUrl,
        path: moviePath,
        title: moviePath.split('/').pop().replace(/-/g, ' ').replace('.html', '')
    };

    // Récupération des films existants dans le localStorage
    let trendingMovies = JSON.parse(localStorage.getItem('trendingMovies')) || [];

    // Éviter les doublons
    if (!trendingMovies.some(m => m.path === movie.path)) {
        // Ajouter le nouveau film au début du tableau
        trendingMovies.unshift(movie); // Ajoute le film au début

        // Si la limite est atteinte, retirer le film le plus ancien
        if (trendingMovies.length > 20) {
            trendingMovies.pop(); // Supprime le dernier élément (le plus ancien)
        }

        // Enregistrer dans le localStorage
        localStorage.setItem('trendingMovies', JSON.stringify(trendingMovies));
    }
}

// Fonction pour afficher les films récemment visionnés
function displayRecentlyWatchedMovies() {
    const trendingMovies = JSON.parse(localStorage.getItem('trendingMovies')) || [];
    const recentlyWatchedSection = document.querySelector('.video-shows-section.vfx-item-ptb');
    const recentlyWatchedContainer = document.getElementById('recently-watched');

    // Cacher la section si aucun film n'est présent
    if (trendingMovies.length === 0) {
        if (recentlyWatchedSection) {
            recentlyWatchedSection.style.display = 'none';
        }
        return;
    } else {
        if (recentlyWatchedSection) {
            recentlyWatchedSection.style.display = 'block';
        }
    }

    if (!recentlyWatchedContainer) return; // Ne rien faire si le conteneur n'existe pas

    recentlyWatchedContainer.innerHTML = ''; // Nettoyer le conteneur avant d'ajouter des films

    // Ajouter chaque film au conteneur
    trendingMovies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('single-video');

        movieItem.innerHTML = `
            <a href="${movie.path}" title="${movie.title}">
                <div class="video-img">
                    <span class="video-item-content">${movie.title}</span>
                    <img src="${movie.poster}" alt="${movie.title}" title="Movies-${movie.title}">
                </div>
            </a>
        `;

        recentlyWatchedContainer.appendChild(movieItem);
    });

    $(document).ready(function(){
        $(".owl-carousel").owlCarousel({
            loop: false,  // Activer le défilement infini
            margin: 10,  // Espacement entre les éléments
            nav: true, 
            dots: true, // Points de navigation
            navText: ["<i class='fas fa-angle-left'></i>", "<i class='fas fa-angle-right'></i>"],  // Afficher les flèches de navigation
            responsive: {
                0: {      // Pour les petits écrans (mobile)
                    items: 2  // Afficher 2 éléments à la fois
                },
                600: {    // Pour les écrans de plus de 600px de large (tablette)
                    items: 3  // Afficher 3 éléments à la fois
                },
                1000: {   // Pour les écrans de plus de 1000px de large (bureau)
                    items: 6  // Afficher 6 éléments à la fois
                }
            }
        });
    });
    
}

// Exécuter au chargement de la page d'accueil
document.addEventListener('DOMContentLoaded', displayRecentlyWatchedMovies);

// Ajouter un film si on est sur une page de film
if (document.getElementById('poster-watch-movie')) {
    addMovieToTrending();
}