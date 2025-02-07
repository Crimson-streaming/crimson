document.addEventListener('DOMContentLoaded', () => {
    const screenIsLargeEnough = window.innerWidth >= 600;

    const playerControls = screenIsLargeEnough ?
        ['play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'volume', 'settings', 'captions', 'pip', 'airplay', 'fullscreen'] :
        ['play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'settings', 'captions', 'pip', 'airplay', 'fullscreen'];

    const player = new Plyr('#player', {
        controls: playerControls,
        settings: ["captions", "quality", "speed"],
        playsinline: true,
        keyboard: {
            focused: true,
            global: true
        },
        fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: true
        },
        storage: {
            enabled: true,
            key: "player"
        },
        invertTime: false,
        disableContextMenu: true,
        ratio: "16:9",
        i18n: {
            restart: 'Recommencer',
            rewind: 'Revenir de {seektime}s',
            play: 'Lecture',
            pause: 'Pause',
            fastForward: 'Avancer de {seektime}s',
            seek: 'Rechercher',
            seekLabel: '{currentTime} de {duration}',
            played: 'Lancé',
            buffered: 'Mis en mémoire',
            currentTime: 'Temps actuel',
            duration: 'Durée',
            volume: 'Volume',
            mute: 'Silence',
            unmute: 'Son activé',
            enableCaptions: 'Activer les sous-titres',
            disableCaptions: 'Désactiver les sous-titres',
            download: 'Télécharger',
            enterFullscreen: 'Plein écran',
            exitFullscreen: 'Sortir du plein écran',
            frameTitle: 'Lecteur pour {title}',
            captions: 'Sous-titres',
            settings: 'Réglages',
            pip: 'Picture-In-Picture',
            menuBack: 'Retour au menu précédent',
            speed: 'Vitesse',
            normal: 'Normal',
            quality: 'Qualité',
            loop: 'Boucle',
            start: 'Début',
            end: 'Fin',
            all: 'Tous',
            reset: 'Réinitialiser',
            disabled: 'Désactivé',
            enabled: 'Activé',
            advertisement: 'Publicité',
        },
        volume: 1,
        muted: false
    });

    const videoElement = document.getElementById('player');
    const loaderElement = document.getElementById('video-loader');
    const hlsSource = videoElement.querySelector('source').src;

    const storageKey = `videoCurrentTime_${encodeURIComponent(hlsSource)}`;


const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;


if (!isIOS) {
    player.on('ready', () => {
        const container = document.querySelector('.plyr__controls');
        if (!container) return;

        const pipButton = container.querySelector('[data-plyr="pip"]');
        if (pipButton) {
            const airplayButton = document.createElement('button');
            airplayButton.classList.add('plyr__control');
            airplayButton.id = 'castButton';

            airplayButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100" height="100">
                    <path d="M447.8 64H64c-23.6 0-42.7 19.1-42.7 42.7v63.9H64v-63.9h383.8v298.6H298.6V448H448c23.6 0 42.7-19.1 42.7-42.7V106.7C490.7 83.1 471.4 64 447.8 64zM21.3 383.6L21.3 383.6l0 63.9h63.9C85.2 412.2 56.6 383.6 21.3 383.6L21.3 383.6zM21.3 298.6V341c58.9 0 106.6 48.1 106.6 107h42.7C170.7 365.6 103.7 298.7 21.3 298.6zM213.4 448h42.7c-.5-129.5-105.3-234.3-234.8-234.6l0 42.4C127.3 255.6 213.3 342 213.4 448z" fill="white"/>
                </svg>
            `;

            pipButton.insertAdjacentElement('afterend', airplayButton);

            const castButton = document.getElementById("castButton");
            if (castButton) {
                castButton.addEventListener("click", () => {
                    const castContext = cast.framework.CastContext.getInstance();

                    if (!castContext.getCastState()) {
                        castContext.setOptions(castOptions);
                    }

                    const castState = castContext.getCastState();
                    if (castState === cast.framework.CastState.CONNECTING || castState === cast.framework.CastState.CONNECTED) {
                        startCasting();
                    } else {
                        castContext.requestSession();
                    }
                });
            } else {
                console.error("Le bouton Cast n'a pas été trouvé.");
            }
        }
    });
}
const loadVideoTime = () => {
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) {
            videoElement.currentTime = parseFloat(savedTime);
        }
    };

    const toggleLoader = (show) => {
        loaderElement.style.display = show ? 'block' : 'none';
    };

    toggleLoader(false);

    videoElement.addEventListener('pause', () => {
        toggleLoader(false);
    });

    videoElement.addEventListener('play', () => {
        toggleLoader(true);
    });

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsSource);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => toggleLoader(false));
        hls.on(Hls.Events.BUFFER_STALLED, () => toggleLoader(true));

        videoElement.addEventListener('timeupdate', () => {
            localStorage.setItem(storageKey, videoElement.currentTime);
        });

        videoElement.addEventListener('waiting', () => toggleLoader(true));
        videoElement.addEventListener('playing', () => toggleLoader(false));

        loadVideoTime();
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = hlsSource;

        videoElement.addEventListener('loadeddata', () => toggleLoader(false));
        videoElement.addEventListener('waiting', () => toggleLoader(true));
        videoElement.addEventListener('timeupdate', () => {
            localStorage.setItem(storageKey, videoElement.currentTime);
        });

        loadVideoTime();
    } else {
        console.error('HLS non supporté, ou aucun fallback compatible disponible.');
        toggleLoader(false); // Masquer le loader en cas d'erreur
    }
    function initializeCastApi() {
        if (typeof cast === 'undefined' || !cast.framework) {
            console.error("Google Cast Framework non disponible.");
            return;
        }

        const castContext = cast.framework.CastContext.getInstance();

        castContext.setOptions({
            receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        });

        castContext.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, (event) => {
            if (event.sessionState === cast.framework.SessionState.SESSION_STARTED ||
                event.sessionState === cast.framework.SessionState.SESSION_RESUMED) {
                startCasting();
            }
        });
    }

    function startCasting() {
        const castContext = cast.framework.CastContext.getInstance();
        const castSession = castContext.getCurrentSession();

        if (castSession) {
            const videoElement = document.querySelector("#player source");
            const videoSource = videoElement ? videoElement.src : null;

            if (videoSource) {
                const mediaInfo = new chrome.cast.media.MediaInfo(videoSource, "application/x-mpegURL");
                mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
                mediaInfo.metadata.title = "CAST | Crimson";

                const loadRequest = new chrome.cast.media.LoadRequest(mediaInfo);
                castSession
                    .loadMedia(loadRequest)
                    .then(() => console.log("Vidéo diffusée avec succès."))
                    .catch((error) => console.error("Erreur de diffusion :", error));
            }
        }
    }

    window['__onGCastApiAvailable'] = function(isAvailable) {
        if (isAvailable) {
            initializeCastApi();
        } else {
            console.error("API Google Cast non disponible.");
        }
    };
});

document.querySelector('#regarder').addEventListener('click', function (e) {
    var lecteur = document.querySelector('#player');

    lecteur.scrollIntoView({
      behavior: 'smooth',
      block: 'center'    
    });

    setTimeout(function () {
      if (lecteur && typeof Plyr !== 'undefined') {
        var plyrInstance = new Plyr(lecteur);

        plyrInstance.play().catch(error => {
          console.error('Erreur lors de la tentative de lecture automatique :', error);
        });
      } else {
        console.error('Le lecteur Plyr n’est pas détecté ou n’a pas été initialisé correctement.');
      }
    }, 500);
  }); 