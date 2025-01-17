// Fonction pour mélanger un tableau
function melangerTableau(tableau) {
    for (let i = tableau.length - 1; i > 0; i--) {
        const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * (i + 1));
        [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    }
    return tableau;
}

// Variable globale pour stocker les données des films
let filmsData = null;

// Fonction pour charger les données des films une seule fois
async function chargerFilms() {
    if (!filmsData) {
        try {
            const response = await fetch('search/data.json'); // Chemin vers le fichier JSON
            if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
            filmsData = await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des données des films :', error);
            filmsData = []; // Définit une valeur par défaut pour éviter des erreurs ultérieures
        }
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
        carousel.innerHTML = filmsFiltres.length
            ? filmsFiltres.map(film => `
                <div class="single-video">
                    <a href="${film.emplacement}" title="${film.nom}">
                        <div class="video-img">
                            <span class="video-item-content">${film.nom}</span>
                            <img src="${film.affiche}" alt="${film.nom}"  loading="lazy">
                        </div>
                    </a>
                </div>
            `).join('')
            : '<p>Aucun film trouvé.</p>';

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

// Charger les films après le chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Chargement parallèle des catégories
        await Promise.all(CATEGORIES.map(({ name, container }) => chargerCategorie(name, container)));
        console.log('Toutes les catégories ont été chargées avec succès.');
    } catch (error) {
        console.error('Erreur lors du chargement des catégories :', error);
    }
});
