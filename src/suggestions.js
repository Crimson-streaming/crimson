document.addEventListener("DOMContentLoaded", async function () {
    try {
        const fullTitle = document.title;
        const regex = /Regarder\s(.+?)\sen\sstreaming/;
        const match = fullTitle.match(regex);
        if (!match || !match[1]) {
            console.error("Impossible d'extraire le nom du film depuis le titre HTML.");
            return;
        }
        const filmName = match[1].trim();
        console.log("Nom du film extrait :", filmName);

        const dataResponse = await fetch('../search/data.json');
        const dataFilms = await dataResponse.json();

        const searchResponse = await fetch('../search/f.json');
        const searchFilms = await searchResponse.json();

        const currentFilm = dataFilms.find(film => film.nom === filmName);
        if (!currentFilm) {
            console.error("Film introuvable dans data.json :", filmName);
            return;
        }
        const currentGenres = currentFilm.genre.split(',').map(g => g.trim());
        console.log("Genres du film :", currentGenres);

        const recommendedFilms = dataFilms
        .filter(film => film.nom !== filmName)
        .map(film => {
            const filmGenres = film.genre.split(',').map(g => g.trim());
            const commonGenres = filmGenres.filter(genre => currentGenres.includes(genre));
            return {
                ...film,
                commonGenresCount: commonGenres.length
            };
        })
        .filter(film => film.commonGenresCount > 0)
        .sort((a, b) => b.commonGenresCount - a.commonGenresCount)
        .slice(0, 10);
    
        console.log("Films recommandés :", recommendedFilms);

        const filmsWithPaths = recommendedFilms.map(film => {
            const searchFilm = searchFilms.find(item => item.nom === film.nom);
            return {
                ...film,
                emplacement: searchFilm ? searchFilm.emplacement.split('/').pop() : null
            };
        }).filter(film => film.emplacement);

        console.log("Films avec emplacements :", filmsWithPaths);

        const carouselContainer = document.getElementById('suggestions-carousel');
        if (!carouselContainer) {
            console.error("Le conteneur du carousel n'a pas été trouvé.");
            return;
        }

        filmsWithPaths.forEach(film => {
            const suggestionHtml = `
                <div class="item">
                    <div class="single-video">
                        <a href="${film.emplacement}" title="${film.nom}">
                            <div class="video-img"> 
                                <span class="video-item-content">${film.nom}</span>
                                <img src="${film.affiche}" alt="${film.nom}" title="${film.nom}">         
                            </div>       
                        </a>
                    </div>
                </div>`;
            carouselContainer.innerHTML += suggestionHtml;
        });

        $('.owl-carousel').owlCarousel({
            loop: false,
            margin: 10,
            nav: true,
            navText: [
                '<i class="fas fa-angle-left"></i>',
                '<i class="fas fa-angle-right"></i>'
            ],
            responsive: {
                0: {
                    items: 2,
                    slideBy: 2,
                    margin: 15
                },
                480: {
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
                    items: 7,
                    slideBy: 7
                }
            }
        });
    } catch (error) {
        console.error("Erreur lors du traitement :", error);
    }
});