const itemsPerPage = 48; // Nombre de films par page
let currentPage = 1; // Page actuelle
let films = []; // Tableau des films

// Charger les films depuis le fichier JSON
async function loadFilms() {
    try {
        const response = await fetch('search/f.json'); // Chemin vers le fichier JSON
        films = await response.json();
        renderFilms(currentPage);
        renderPagination();
    } catch (error) {
        console.error("Erreur lors du chargement des films :", error);
    }
}

// Afficher les films pour une page donnée
function renderFilms(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filmsToShow = films.slice(startIndex, endIndex);

    const container = document.getElementById("movies-container");
    container.innerHTML = ""; // Vider le conteneur avant d'ajouter les films

    filmsToShow.forEach(film => {
        container.innerHTML += `
            <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12 col-6">
                <div class="single-video">
                    <a href="${film.emplacement}" title="${film.nom}">
                        <div class="video-img">
                            <span class="video-item-content">${film.nom}</span>
                            <img src="${film.affiche}" alt="${film.nom}" loading="lazy">
                        </div>
                    </a>
                </div>
            </div>
        `;
    });
}

// Gérer les liens de pagination avec un maximum de 11 pages visibles
function renderPagination() {
    const totalPages = Math.ceil(films.length / itemsPerPage);
    const paginationContainer = document.getElementById("pagination-links");
    paginationContainer.innerHTML = ""; // Vider les liens de pagination

    const maxVisiblePages = 11; // Nombre maximum de pages affichées
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajuster si on est au début ou à la fin
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Bouton précédent
    paginationContainer.innerHTML += `
        <li class="${currentPage === 1 ? "disabled" : ""}">
            <a class="prev page-numbers" href="#" onclick="changePage(${currentPage - 1})"><i class="fa fa-caret-left"></i></a>
        </li>
    `;

    // Liens des pages visibles
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

// Changer de page
function changePage(page) {
    const totalPages = Math.ceil(films.length / itemsPerPage);
    if (page < 1 || page > totalPages) return; // Vérifier les limites

    currentPage = page;
    renderFilms(currentPage);
    renderPagination();
}

// Charger les films à l'initialisation
loadFilms();
