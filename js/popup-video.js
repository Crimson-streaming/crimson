// popup-video.js

document.addEventListener("DOMContentLoaded", () => {
    const trailerButton = document.getElementById("2222"); // Bouton spécifique
    const popup = document.getElementById("video-popup");
    const rectangle = document.querySelector(".popup-rectangle");
    const youtubePlayer = document.getElementById("youtube-player");

    // Ouvrir la popup avec animation
    trailerButton.addEventListener("click", () => {
        const videoUrl = trailerButton.getAttribute("data-video"); // Récupère l'URL depuis data-video
        if (!videoUrl) {
            console.error("Aucune URL de vidéo spécifiée dans l'attribut data-video !");
            return;
        }

        popup.style.display = "flex"; // Affiche la popup
        popup.classList.remove("closing"); // Retire l'état de fermeture précédent

        setTimeout(() => {
            popup.classList.add("active"); // Lance l'animation d'agrandissement
            youtubePlayer.src = `${videoUrl}?autoplay=1`; // Charge la vidéo avec autoplay
            youtubePlayer.style.opacity = "1"; // Affiche le lecteur
        }, 10);
    });

    // Fermer la popup proprement
    popup.addEventListener("click", () => {
        youtubePlayer.style.opacity = "0"; // Cache doucement la vidéo
        youtubePlayer.src = ""; // Arrête la vidéo

        popup.classList.remove("active"); // Retire l'état agrandi
        popup.classList.add("closing"); // Lance l'animation de rétrécissement

        // Attendre la fin de l'animation pour cacher complètement la popup
        setTimeout(() => {
            popup.style.display = "none";
            popup.classList.remove("closing"); // Nettoie les classes
        }, 400); // Durée identique à celle de la transition CSS
    });
});
