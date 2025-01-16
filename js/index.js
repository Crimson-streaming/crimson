// Fonction pour mélanger un tableau
function melangerTableau(tableau) {
    for (let i = tableau.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    }
    return tableau;
}

// Fonction pour charger les films sous une catégorie donnée
async function chargerCategorie(categorie, conteneur) {
    try {
        const response = await fetch('https://crimson-streaming.github.io/crimson/search/data.json'); // Chemin vers le fichier JSON
        const films = await response.json();

        // Mélanger les films pour les parcourir de manière aléatoire
        const filmsMelanges = melangerTableau(films);

        // Filtrer les films selon la catégorie et limiter à 28 films
        const filmsFiltres = filmsMelanges.filter(film => film.genre.includes(categorie)).slice(0, 28);

        // Sélectionner le conteneur carousel spécifique
        const carousel = document.querySelector(conteneur);

        // Vider le contenu existant
        carousel.innerHTML = '';

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

    } catch (error) {
        console.error(`Erreur lors du chargement des films pour la catégorie "${categorie}" :`, error);
    }
}

// Charger les films après le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    chargerCategorie('Action', '.video-carousel-action'); 
    chargerCategorie('Drame', '.video-carousel-drame');
    chargerCategorie('Horreur', '.video-carousel-horreur');
    chargerCategorie('Animation', '.video-carousel-animation');  
    chargerCategorie('Crime', '.video-carousel-policier');
    chargerCategorie('Guerre', '.video-carousel-guerre');
    chargerCategorie('Comédie', '.video-carousel-comedie');
    chargerCategorie('Histoire', '.video-carousel-histoire');
    chargerCategorie('Romance', '.video-carousel-romance');
    chargerCategorie('Aventure', '.video-carousel-aventure');
    chargerCategorie('Fantastique', '.video-carousel-fantastique');
    chargerCategorie('Familial', '.video-carousel-famille');
    chargerCategorie('Mystère', '.video-carousel-mystère');
    chargerCategorie('Thriller', '.video-carousel-thriller');
    chargerCategorie('Science-Fiction', '.video-carousel-science-fiction');
});
