function toggleWatchlist(element, nom, affiche, emplacement) {
    const movie = { nom, affiche, emplacement };
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    const movieIndex = watchlist.findIndex(item => item.nom === nom);

    if (movieIndex === -1) {
        watchlist.push(movie);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        element.innerHTML = '<i class="fa fa-check"></i>Supprimer de ma liste';
        element.onclick = () => toggleWatchlist(element, nom, affiche, emplacement);
    } else {
        watchlist.splice(movieIndex, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        element.innerHTML = '<i class="fa fa-plus"></i>Ajouter à ma liste';
        element.onclick = () => toggleWatchlist(element, nom, affiche, emplacement);
    }
}