// Fonction qui initialise l'API Google Cast
function initializeCastApi() {
    const castParameter = '<?php echo $castParameter; ?>';

    // Vérifie si l'API Cast est disponible
    if (typeof cast === 'undefined' || !cast.framework) {
      console.error('Impossible d\'initialiser : Google Cast Framework non disponible.');
      return;
    }

    // Récupère l'instance de CastContext
    const castContext = cast.framework.CastContext.getInstance();

    // Configure les options de la session de Cast
    castContext.setOptions({
      receiverApplicationId: chrome.cast.receiver.applicationId,
      autoJoinPolicy: chrome.cast.receiver.autoJoinPolicy.ORIGIN_SCOPED
    });

    // Écoute l'événement de changement d'état de session
    castContext.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, (event) => {
      const sessionState = event.sessionState;

      // Gère les différents états de session
      switch (sessionState) {
        case cast.framework.SessionState.SESSION_STARTED:
        case cast.framework.SessionState.SESSION_RESUMED:
          const session = castContext.getCurrentSession();
          const videoElement = document.getElementById('video-source');
          let mediaSource = videoElement ? videoElement.src : null;

          // Ajoute un paramètre à la source vidéo si disponible
          if (mediaSource) {
            mediaSource += '?c=' + castParameter;
          }

          // Crée un objet MediaInfo avec la source et les métadonnées
          const mediaInfo = new chrome.cast.media.MediaInfo(mediaSource, 'application/x-mpegURL');
          mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
          mediaInfo.metadata.title = 'CAST | Crimson';

          // Crée une requête de chargement de média
          const loadRequest = new chrome.cast.media.LoadRequest(mediaInfo);

          // Charge le média sur la session Cast
          session.loadMedia(loadRequest)
            .then(() => {
              const player = window.myPlyr;
              if (player) {
                player.play();
              }
            })
            .catch((error) => {
              console.error('Erreur lors du chargement du média', error);
            });
          break;
      }
    });
  }

  // Fonction qui vérifie la disponibilité de l'API Cast et initialise l'API
  window.onload = function(isCastAvailable) {
    if (isCastAvailable) {
      if (typeof cast !== 'undefined' && cast.framework) {
        initializeCastApi();
      } else {
        console.error('Google Cast Framework non chargé.');
      }
    } else {
      console.error('Google Cast API non disponible.');
    }
  };