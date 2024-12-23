document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Étape 1 : Extraire le nom du film à partir de <title>
        const fullTitle = document.title;
        const regex = /Regarder\s(.+?)\sen\sstreaming/;
        const match = fullTitle.match(regex);
        if (!match || !match[1]) {
            console.error("Impossible d'extraire le nom du film depuis le titre HTML.");
            return;
        }
        const filmName = match[1].trim();
        console.log("Nom du film extrait :", filmName);

        // Étape 2 : Charger les fichiers JSON
        const dataResponse = await fetch('../search/data.json');
        const dataFilms = await dataResponse.json();

        const searchResponse = await fetch('../search/f.json');
        const searchFilms = await searchResponse.json();

        // Étape 3 : Trouver les genres du film extrait
        const currentFilm = dataFilms.find(film => film.nom === filmName);
        if (!currentFilm) {
            console.error("Film introuvable dans data.json :", filmName);
            return;
        }
        const currentGenres = currentFilm.genre.split(',').map(g => g.trim());
        console.log("Genres du film :", currentGenres);

        // Étape 4 : Trouver des films avec des genres similaires
        const recommendedFilms = dataFilms
        .filter(film => film.nom !== filmName) // Exclure le film actuel
        .map(film => {
            const filmGenres = film.genre.split(',').map(g => g.trim());
            const commonGenres = filmGenres.filter(genre => currentGenres.includes(genre));
            return {
                ...film,
                commonGenresCount: commonGenres.length // Nombre de genres communs
            };
        })
        .filter(film => film.commonGenresCount > 0) // Garder les films avec au moins un genre en commun
        .sort((a, b) => b.commonGenresCount - a.commonGenresCount) // Trier par pertinence (plus de genres communs d'abord)
        .slice(0, 10); // Limiter à 10 résultats
    

        console.log("Films recommandés :", recommendedFilms);

        // Étape 5 : Trouver leurs emplacements dans f.json
        const filmsWithPaths = recommendedFilms.map(film => {
            const searchFilm = searchFilms.find(item => item.nom === film.nom);
            return {
                ...film,
                emplacement: searchFilm ? searchFilm.emplacement.split('/').pop() : null
            };
        }).filter(film => film.emplacement);

        console.log("Films avec emplacements :", filmsWithPaths);

        // Étape 6 : Injecter les films dans le carousel
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

        // Étape 7 : Activer Owl Carousel avec les options souhaitées
        $('.owl-carousel').owlCarousel({
            loop: false, // Pas de boucle
            margin: 10, // Espacement entre les éléments
            nav: true, // Active les flèches de navigation
            navText: [
                '<i class="fas fa-angle-left"></i>', // Icône gauche
                '<i class="fas fa-angle-right"></i>' // Icône droite
            ],
            responsive: {
                0: { items: 2 }, // 2 items sur petits écrans
                600: { items: 4 }, // 3 items sur écrans moyens
                1000: { items: 7 } // 6 items sur écrans larges
            }
        });

    } catch (error) {
        console.error("Erreur lors du traitement :", error);
    }
});

//smoth scroll
document.querySelector('#regarder').addEventListener('click', function (e) {

    var lecteur = document.querySelector('#player');

    lecteur.scrollIntoView({
      behavior: 'smooth',
      block: 'center'    
    });
  });