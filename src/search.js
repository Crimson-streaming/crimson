async function showSuggestions(query) {
    const searchOutput = document.getElementById('search_output');
    searchOutput.innerHTML = '';
  
    if (!query) return;
  
    try {
        const response = await fetch('../search/d.json');
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        const movies = await response.json();

        const normalizedQuery = normalizeString(query);

        const filteredMovies = movies.filter(movie =>
            normalizeString(movie.nom).includes(normalizedQuery)
        );

        const limitedMovies = filteredMovies.slice(0, 48);

        if (limitedMovies.length > 0) {
            limitedMovies.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('single-video');
                movieDiv.innerHTML = `
                    <a href="${movie.emplacement}">
                        <div class="video-img">
                            <span class="video-item-content">${movie.nom}</span>
                            <img src="${movie.affiche}" alt="${movie.nom}">
                        </div>
                    </a>
                `;
                searchOutput.appendChild(movieDiv);
            });
        } else {
            searchOutput.innerHTML = '<p>Aucun résultat trouvé.</p>';
        }
    } catch (error) {
        searchOutput.innerHTML = '<p>Une erreur est survenue lors du chargement des données.</p>';
        console.error('Erreur de recherche:', error);
    }
}

function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['’]/g, '')
        .replace(/-/g, ' ')
        .trim();
}