document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour initialiser HLS.js sur un élément vidéo
    const initializeHLS = (videoElement) => {
      const hlsSource = videoElement.getAttribute('src');
  
      if (!hlsSource || !hlsSource.endsWith('.m3u8')) {
        console.warn(`Skipping video element without a valid .m3u8 source:`, videoElement);
        return;
      }
  
      // Utiliser l'URL comme clé unique pour sauvegarder le temps de lecture
      const storageKey = `videoCurrentTime_${encodeURIComponent(hlsSource)}`;
  
      // Charger le temps de lecture
      const loadVideoTime = () => {
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) {
          videoElement.currentTime = parseFloat(savedTime);
        }
      };
  
      // Sauvegarder le temps de lecture
      const saveVideoTime = () => {
        localStorage.setItem(storageKey, videoElement.currentTime);
      };
  
      // Formatage du temps en minutes:secondes ou heures:minutes:secondes
      const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
  
        if (hrs > 0) {
          return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
      };
  
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(videoElement);
  
        // Gestionnaire d'erreurs
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error(`HLS.js error: ${data.type}`, data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Network error, retrying...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Media error, trying to recover...");
                hls.recoverMediaError();
                break;
              default:
                console.error("Unrecoverable error, destroying HLS instance...");
                hls.destroy();
                break;
            }
          }
        });
  
        videoElement.addEventListener('timeupdate', saveVideoTime);
        loadVideoTime(); // Charger le temps de lecture
  
        videoElement.addEventListener('ended', () => {
          hls.loadSource(hlsSource);
          videoElement.play(); // Replay video
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback pour le support natif HLS (Safari)
        videoElement.src = hlsSource;
  
        videoElement.addEventListener('timeupdate', saveVideoTime);
        loadVideoTime(); // Charger le temps de lecture
  
        videoElement.addEventListener('ended', () => {
          videoElement.play(); // Replay video
        });
      }
  
      // Afficher la durée de la vidéo une fois les métadonnées chargées
      videoElement.addEventListener('loadedmetadata', () => {
        const duration = videoElement.duration;
        const formattedDuration = formatTime(duration);
        console.log(`Duration of video: ${formattedDuration}`);
      });
    };
  
    // Rechercher tous les éléments <video> dans la page
    const videoElements = document.querySelectorAll('video');
  
    // Initialiser HLS.js sur chaque vidéo ayant une source .m3u8
    videoElements.forEach((videoElement) => {
      initializeHLS(videoElement);
    });
  });
  