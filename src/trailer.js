document.addEventListener("DOMContentLoaded", () => {
    const trailerButton = document.getElementById("2222");
    const popup = document.getElementById("video-popup");
    const rectangle = document.querySelector(".popup-rectangle");
    const youtubePlayer = document.getElementById("youtube-player");

    trailerButton.addEventListener("click", () => {
        const videoUrl = trailerButton.getAttribute("data-video");
        if (!videoUrl) {
            console.error("Aucune URL de vidéo spécifiée dans l'attribut data-video !");
            return;
        }

        popup.style.display = "flex";
        popup.classList.remove("closing");

        setTimeout(() => {
            popup.classList.add("active");
            youtubePlayer.src = `${videoUrl}?autoplay=1`;
            youtubePlayer.style.opacity = "1";
        }, 10);
    });

    popup.addEventListener("click", () => {
        youtubePlayer.style.opacity = "0";
        youtubePlayer.src = "";

        popup.classList.remove("active");
        popup.classList.add("closing");

        setTimeout(() => {
            popup.style.display = "none";
            popup.classList.remove("closing");
        }, 400);
    });
});