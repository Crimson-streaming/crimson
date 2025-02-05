// Fonction pour ajouter un film à la liste des films récemment visionnés
function addMovieToTrending() {
    const posterDiv = document.getElementById('poster-watch-movie');
    if (!posterDiv) return;

    const posterStyle = posterDiv.style.backgroundImage;
    const posterUrlMatch = posterStyle.match(/url\((['"]?)(.*?)\1\)/);
    if (!posterUrlMatch) return;
    const posterUrl = posterUrlMatch[2];

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) return;
    const moviePath = 'film/' + canonicalLink.getAttribute('href');

    const movie = {
        poster: posterUrl,
        path: moviePath,
        title: moviePath.split('/').pop().replace(/-/g, ' ').replace('.html', '')
    };

    let trendingMovies = JSON.parse(localStorage.getItem('trendingMovies')) || [];

    if (!trendingMovies.some(m => m.path === movie.path)) {
        trendingMovies.unshift(movie);

        if (trendingMovies.length > 20) {
            trendingMovies.pop();
        }

        localStorage.setItem('trendingMovies', JSON.stringify(trendingMovies));
    }
}

function displayRecentlyWatchedMovies() {
    const trendingMovies = JSON.parse(localStorage.getItem('trendingMovies')) || [];
    const recentlyWatchedSection = document.querySelector('.video-shows-section.vfx-item-ptb');
    const recentlyWatchedContainer = document.getElementById('recently-watched');

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

    if (!recentlyWatchedContainer) return;

    recentlyWatchedContainer.innerHTML = '';

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
            nav: true,
            margin: 20,
            navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
            responsive: {
                0: {
                    items: 2,
                    slideBy: 2,
                },
                640: {
                    items: 3,
                    slideBy: 3
                },
                768: {
                    items: 4,
                    slideBy: 4
                },
                991: {
                    items: 5,
                    slideBy: 5
                },
                1198: {
                    items: 6,
                    slideBy: 6
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', displayRecentlyWatchedMovies);

if (document.getElementById('poster-watch-movie')) {
    addMovieToTrending();
}