const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('.video-container video');
const controlsContainer = document.querySelector('.video-container .controls-container');

// Boutons et éléments de contrôle
const playPauseButton = document.querySelector('.video-container .controls button.play-pause');
const rewindButton = document.querySelector('.video-container .controls button.rewind');
const fastForwardButton = document.querySelector('.video-container .controls button.fast-forward');
const volumeButton = document.querySelector('.video-container .controls button.volume');
const fullScreenButton = document.querySelector('.video-container .controls button.full-screen');
const playButton = playPauseButton.querySelector('.playing');
const pauseButton = playPauseButton.querySelector('.paused');
const fullVolumeButton = volumeButton.querySelector('.full-volume');
const mutedButton = volumeButton.querySelector('.muted');
const maximizeButton = fullScreenButton.querySelector('.maximize');
const minimizeButton = fullScreenButton.querySelector('.minimize');

const progressBar = document.querySelector('.video-container .progress-controls .progress-bar');
const watchedBar = document.querySelector('.video-container .progress-controls .progress-bar .watched-bar');
const timeLeft = document.querySelector('.video-container .progress-controls .time-remaining');

let controlsTimeout;
controlsContainer.style.opacity = '0';
watchedBar.style.width = '0px';
pauseButton.style.display = 'none';
minimizeButton.style.display = 'none';

// URL source de la vidéo
const hlsSource = video.getAttribute('data-src');

// Fonction pour charger et gérer les vidéos HLS
const setupHlsVideo = () => {
    if (!hlsSource) return;

    const storageKey = `videoCurrentTime_${encodeURIComponent(hlsSource)}`;

    // Charger le temps de lecture depuis localStorage
    const loadVideoTime = () => {
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) {
            video.currentTime = parseFloat(savedTime);
        }
    };

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(video);

        video.addEventListener('ended', () => {
            hls.loadSource(hlsSource);
            video.play(); // Redémarre la vidéo
        });

        // Sauvegarder le temps de lecture
        video.addEventListener('timeupdate', () => {
            localStorage.setItem(storageKey, video.currentTime);
        });

        loadVideoTime();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Support natif HLS (Safari)
        video.src = hlsSource;
        video.addEventListener('ended', () => {
            video.play(); // Redémarre la vidéo
        });

        // Sauvegarder le temps de lecture
        video.addEventListener('timeupdate', () => {
            localStorage.setItem(storageKey, video.currentTime);
        });

        loadVideoTime();
    } else {
        console.error('HLS non pris en charge par ce navigateur.');
    }
};

// Appeler la configuration HLS
setupHlsVideo();

// Gestion des contrôles (inchangé)
const displayControls = () => {
    controlsContainer.style.opacity = '1';
    document.body.style.cursor = 'initial';
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
    }
    controlsTimeout = setTimeout(() => {
        controlsContainer.style.opacity = '0';
        document.body.style.cursor = 'none';
    }, 5000);
};

const playPause = () => {
    if (video.paused) {
        video.play();
        playButton.style.display = 'none';
        pauseButton.style.display = '';
    } else {
        video.pause();
        playButton.style.display = '';
        pauseButton.style.display = 'none';
    }
};

const toggleMute = () => {
    video.muted = !video.muted;
    if (video.muted) {
        fullVolumeButton.style.display = 'none';
        mutedButton.style.display = '';
    } else {
        fullVolumeButton.style.display = '';
        mutedButton.style.display = 'none';
    }
};

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        maximizeButton.style.display = '';
        minimizeButton.style.display = 'none';
    } else {
        maximizeButton.style.display = 'none';
        minimizeButton.style.display = '';
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        playPause();
    }

    if (event.code === 'KeyM') {
        toggleMute();
    }

    if (event.code === 'KeyF') {
        toggleFullScreen();
    }

    displayControls();
});

document.addEventListener('mousemove', displayControls);

video.addEventListener('timeupdate', () => {
    watchedBar.style.width = ((video.currentTime / video.duration) * 100) + '%';

    const totalSecondsRemaining = video.duration - video.currentTime;
    const time = new Date(null);
    time.setSeconds(totalSecondsRemaining);

    const hours = totalSecondsRemaining >= 3600 ? String(time.getUTCHours()).padStart(2, '0') : null;
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(time.getUTCSeconds()).padStart(2, '0');

    timeLeft.textContent = `${hours ? hours + ':' : ''}${minutes}:${seconds}`;
});

progressBar.addEventListener('click', (event) => {
    const pos = (event.pageX - (progressBar.offsetLeft + progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;
    video.currentTime = pos * video.duration;
});

playPauseButton.addEventListener('click', playPause);
rewindButton.addEventListener('click', () => {
    video.currentTime -= 10;
});
fastForwardButton.addEventListener('click', () => {
    video.currentTime += 10;
});
volumeButton.addEventListener('click', toggleMute);
fullScreenButton.addEventListener('click', toggleFullScreen);

document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.querySelector('video');
    const pipButton = document.querySelector('.pip-button');
  
    // Activer/Désactiver Picture-in-Picture
    pipButton.addEventListener('click', async () => {
      try {
        if (document.pictureInPictureElement) {
          // Quitter PiP si déjà actif
          await document.exitPictureInPicture();
        } else {
          // Activer PiP
          await videoElement.requestPictureInPicture();
        }
      } catch (error) {
        console.error('Erreur avec Picture-in-Picture:', error);
      }
    });
  
    // Désactiver le bouton si PiP n'est pas supporté
    if (!('pictureInPictureEnabled' in document)) {
      pipButton.disabled = true;
      pipButton.title = 'Picture-in-Picture non supporté';
      console.warn('Picture-in-Picture non supporté dans ce navigateur.');
    }
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const airplayButton = document.querySelector('.airplay');
    const videoElement = document.querySelector('video'); // Remplacez par votre élément vidéo
  
    // Activer AirPlay sur clic
    airplayButton.addEventListener('click', () => {
      if (videoElement && videoElement.webkitShowPlaybackTargetPicker) {
        videoElement.webkitShowPlaybackTargetPicker();
      } else {
        alert('AirPlay n’est pas supporté sur ce navigateur ou appareil.');
      }
    });
  
    // Vérifiez si AirPlay est supporté
    if (!window.WebKitPlaybackTargetAvailabilityEvent) {
      airplayButton.disabled = true;
      airplayButton.title = 'AirPlay non supporté';
      console.warn('AirPlay n’est pas supporté sur ce navigateur.');
    }
  });
  