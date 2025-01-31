let allFilms = []; // Liste complète des films
let filteredFilms = []; // Films après filtrage par genre

// Charger les films depuis le JSON
async function loadFilms() {
    try {
        const response = await fetch('search/direct.json'); // Charger les films
        allFilms = await response.json();
        filteredFilms = [...allFilms]; // Par défaut, tous les films sont affichés

        renderFilms(filteredFilms); // Afficher les films
    } catch (error) {
        console.error("Erreur lors du chargement des films :", error);
    }
}

// Afficher les films dynamiquement
function renderFilms(films) {
    const container = document.getElementById("direct-container");
    container.innerHTML = ""; // Vider l'affichage

    films.forEach(film => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 col-6">
                <div class="single-video">
                    <a href="${film.emplacement}" title="${film.nom}">
                        <div class="video-img">
                            <img src="${film.affiche}" alt="${film.nom}" title="${film.nom}">
                        </div>
                        <div class="season-title-item">
                            <h3 class="mb-0">${film.nom}</h3>
                        </div>
                    </a>
                </div>
            </div>
        `;
    });
}

// Filtrer les films par genre
function filterByGenre(genre) {
    if (genre === "all") {
        filteredFilms = [...allFilms]; // Réafficher tous les films
    } else {
        filteredFilms = allFilms.filter(film => film.genre === genre);
    }
    renderFilms(filteredFilms); // Mettre à jour l'affichage
}

// Appliquer le tri (A-Z ou Aléatoire) **sur tous les films**
function applyFilter() {
    let sortedFilms = [...allFilms]; // Toujours travailler sur tous les films

    const filterValue = document.getElementById('filter_list').value;
    if (filterValue === "###") {
        sortedFilms.sort((a, b) => a.nom.localeCompare(b.nom)); // Trier A-Z
    } else if (filterValue === "##") {
        sortedFilms.sort(() => Math.random() - 0.5); // Mélanger aléatoirement
    }

    filteredFilms = [...sortedFilms]; // Mettre à jour la liste affichée
    renderFilms(filteredFilms); // Afficher les films triés
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    loadFilms();

    // Événement pour le tri (A-Z, Aléatoire)
    document.getElementById('filter_list').addEventListener('change', applyFilter);

    // Événement pour le filtre par genre
    document.getElementById('genre_list').addEventListener('change', () => {
        filterByGenre(document.getElementById('genre_list').value);
    });
});
