// Fonction pour mélanger un tableau
function melangerTableau(tableau) {
    for (let i = tableau.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    }
    return tableau;
}

// Variable globale pour stocker les données des films
let filmsData = null;

// Fonction pour charger les données des films une seule fois
async function chargerFilms() {
    if (!filmsData) {
        const response = await fetch('search/data.json'); // Chemin vers le fichier JSON
        filmsData = await response.json();
    }
    return filmsData;
}

// Fonction pour charger les films d'une catégorie donnée
async function chargerCategorie(categorie, conteneur) {
    try {
        const films = await chargerFilms();

        // Mélanger et filtrer les films selon la catégorie
        const filmsFiltres = melangerTableau(films)
            .filter(film => film.genre.includes(categorie))
            .slice(0, 12);

        // Sélectionner le conteneur carousel spécifique
        const carousel = document.querySelector(conteneur);
        carousel.innerHTML = ''; // Vider le contenu existant

        // Générer le contenu dynamique pour chaque film
        filmsFiltres.forEach(film => {
            const filmHTML = `
                <div class="single-video">
                    <a href="${film.emplacement}" title="${film.nom}">
                        <div class="video-img">
                            <span class="video-item-content">${film.nom}</span>
                            <img src="${film.affiche}" alt="${film.nom}" title="${film.nom}">
                        </div>
                    </a>
                </div>
            `;
            carousel.insertAdjacentHTML('beforeend', filmHTML);
        });

        // Réinitialiser Owl Carousel après ajout des éléments
        reinitialiserOwlCarousel(conteneur);

    } catch (error) {
        console.error(`Erreur lors du chargement des films pour la catégorie "${categorie}" :`, error);
    }
}

// Fonction pour réinitialiser Owl Carousel
function reinitialiserOwlCarousel(conteneur) {
    $(conteneur).owlCarousel('destroy'); // Détruire l'instance existante
    $(conteneur).owlCarousel({
        loop: false,
        margin: 10,
        nav: true,
        dots: true,
        navText: ["<i class='fas fa-angle-left'></i>", "<i class='fas fa-angle-right'></i>"],
        responsive: {
            0: { items: 2 },      // Petits écrans
            600: { items: 4 },    // Écrans moyens
            1000: { items: 7 }    // Grands écrans
        }
    });
}

// Charger les films après le chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    const categories = [
        { name: 'Action', container: '.video-carousel-action' },
        { name: 'Drame', container: '.video-carousel-drame' },
        { name: 'Horreur', container: '.video-carousel-horreur' },
        { name: 'Animation', container: '.video-carousel-animation' },
        { name: 'Crime', container: '.video-carousel-policier' },
        { name: 'Guerre', container: '.video-carousel-guerre' },
        { name: 'Comédie', container: '.video-carousel-comedie' },
        { name: 'Histoire', container: '.video-carousel-histoire' },
        { name: 'Romance', container: '.video-carousel-romance' },
        { name: 'Aventure', container: '.video-carousel-aventure' },
        { name: 'Fantastique', container: '.video-carousel-fantastique' },
        { name: 'Familial', container: '.video-carousel-famille' },
        { name: 'Mystère', container: '.video-carousel-mystère' },
        { name: 'Thriller', container: '.video-carousel-thriller' },
        { name: 'Science-Fiction', container: '.video-carousel-science-fiction' }
    ];

    for (const { name, container } of categories) {
        await chargerCategorie(name, container);
    }
});
