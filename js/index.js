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

// Liste des combinaisons interdites
const COMBINAISONS_INTERDITES = [
    ['Action', 'Romance'],
    ['Horreur', 'Familial'],
    ['Science-Fiction', 'Histoire'], 
    ['Guerre', 'Comédie'],          
    ['Drame', 'Fantastique'],
    ['Mystère', 'Animation']
];

// Fonction pour vérifier si un film respecte les restrictions de genre
function estGenreAutorise(film) {
    return !COMBINAISONS_INTERDITES.some(combinaison =>
        combinaison.every(genre => film.genre.includes(genre))
    );
}

// Fonction pour charger les données des films avec cache
// Fonction pour charger les données des films sans les enregistrer
async function chargerFilms() {
    if (!filmsData) {
        try {
            const response = await fetch(`search/p.json?nocache=${Date.now()}`);
            if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
            filmsData = await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des données des films :', error);
            filmsData = []; // Définit une valeur par défaut pour éviter des erreurs ultérieures
        }
    }
    return filmsData;
}


// Fonction pour charger les films avec mélange
async function chargerFilmsAvecMelange() {
    if (!filmsData) {
        filmsData = await chargerFilms();
        filmsData = melangerTableau(filmsData); // Mélanger une seule fois
    }
    return filmsData;
}

// Fonction pour charger les films d'une catégorie donnée
async function chargerCategorie(categorie, conteneur) {
    try {
        const films = await chargerFilms();

        // Mélanger et filtrer les films selon la catégorie et les restrictions de genre
        const filmsFiltres = melangerTableau(films)
            .filter(film => film.genre.includes(categorie) && estGenreAutorise(film))
            .slice(0, 12);

        // Sélectionner le conteneur carousel spécifique
        const carousel = document.querySelector(conteneur);
        carousel.innerHTML = '';
        const fragment = document.createDocumentFragment();

        filmsFiltres.forEach(film => {
            const div = document.createElement('div');
            div.classList.add('single-video');
            div.innerHTML = `
                <a href="${film.emplacement}" title="${film.nom}">
                    <div class="video-img">
                        <span class="video-item-content">${film.nom}</span>
                        <img src="${film.affiche}" alt="${film.nom}" loading="lazy">
                    </div>
                </a>`;
            fragment.appendChild(div);
        });
        carousel.appendChild(fragment);

        // Réinitialiser Owl Carousel après ajout des éléments
        reinitialiserOwlCarousel(conteneur);

    } catch (error) {
        console.error(`Erreur lors du chargement des films pour la catégorie "${categorie}" :`, error);
        document.querySelector(conteneur).innerHTML = '<p>Erreur de chargement.</p>';
    }
}

// Fonction pour réinitialiser Owl Carousel
function reinitialiserOwlCarousel(conteneur) {
    const $conteneur = $(conteneur);
    if (!$conteneur.hasClass('owl-carousel')) return;
    const instance = $conteneur.data('owl.carousel');
    if (instance) $conteneur.owlCarousel('destroy');
    $conteneur.owlCarousel({
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

// Liste des catégories et leurs conteneurs
const CATEGORIES = [
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

// Fonction pour charger toutes les catégories
async function chargerToutesLesCategories() {
    try {
        await Promise.all(CATEGORIES.map(({ name, container }) => chargerCategorie(name, container)));
        console.log('Toutes les catégories ont été chargées avec succès.');
    } catch (error) {
        console.error('Erreur lors du chargement des catégories :', error);
    }
}

// Charger les films après le chargement de la page
document.addEventListener('DOMContentLoaded', chargerToutesLesCategories);

// Recharger les films si vous naviguez sans rechargement complet
window.addEventListener('popstate', chargerToutesLesCategories);

// Fonction d'observateur pour charger les catégories lorsque visibles
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const { name, container } = CATEGORIES.find(c => c.container === `.${entry.target.classList[1]}`);
            chargerCategorie(name, container);
            observer.unobserve(entry.target); // Ne plus observer cette catégorie
        }
    });
});

document.querySelectorAll('.video-carousel').forEach(carousel => {
    observer.observe(carousel);
});






// Initialisation du carousel
const videoCarousel = document.getElementById('videoCarousel');

// Ajouter les éléments au carousel
fetch('search/films-en-tendance.json')
    .then(response => response.json())
    .then(movies => {
        movies.forEach(movie => {
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('single-video');
            videoDiv.innerHTML = `
                <a href="${movie.link}" title="${movie.title}">
                    <div class="video-img">
                        <span class="video-item-content">${movie.title}</span>
                        <img src="${movie.img}" alt="${movie.title}" title="${movie.title}">
                    </div>
                </a>
            `;
            videoCarousel.appendChild(videoDiv);
        });
        // Initialiser Owl Carousel après ajout des films
        reinitialiserOwlCarousel('#videoCarousel');
    })
    .catch(error => console.error('Erreur lors du chargement des films :', error));

// Fonction pour réinitialiser Owl Carousel
function reinitialiserOwlCarousel(conteneur) {
    const $conteneur = $(conteneur);
    if ($conteneur.hasClass('owl-carousel')) {
        $conteneur.owlCarousel('destroy'); // Détruire l'instance existante si elle existe
    }
    $conteneur.owlCarousel({
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

// Initialisation du carousel après chargement
$(document).ready(function () {
    reinitialiserOwlCarousel('#videoCarousel');
});

fetch('search/films-en-tendance.json')
    .then(response => response.json())
    .then(movies => {
        const videoContainer = document.querySelector('.view-all-video-area .row');
        movies.forEach(movie => {
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('col-lg-2', 'col-md-3', 'col-sm-4', 'col-xs-12', 'col-6');
            videoDiv.innerHTML = `
                <div class="single-video">
                    <a href="${movie.link}" title="${movie.title}">
                        <div class="video-img">
                            <span class="video-item-content">${movie.title}</span>
                            <img src="${movie.img}" alt="${movie.title}" title="${movie.title}">
                        </div>
                    </a>
                </div>
            `;
            videoContainer.appendChild(videoDiv);
        });
    })