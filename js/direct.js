async function showSuggestions(e){let t=document.getElementById("search_output");if(t.innerHTML="",e)try{let r=await fetch("../search/d.direct.json");if(!r.ok)throw Error("Erreur r\xe9seau");let n=await r.json(),i=normalizeString(e),s=n.filter(e=>normalizeString(e.nom).includes(i)),a=s.slice(0,48);a.length>0?a.forEach(e=>{let r=document.createElement("div");r.classList.add("single-video"),r.innerHTML=`
    <a href="${e.emplacement}">
        <div class="video-img">
            <span class="video-item-content">${e.nom}</span>
            <img src="${e.affiche}" alt="${e.nom}">
        </div>
    </a>
`,t.appendChild(r)}):t.innerHTML="<p>Aucun r\xe9sultat trouv\xe9.</p>"}catch(o){t.innerHTML="<p>Une erreur est survenue lors du chargement des donn\xe9es.</p>",console.error("Erreur de recherche:",o)}}function normalizeString(e){return e.toLowerCase().normalize("NFD").replace(/[u0300-u036f]/g,"").replace(/['’]/g,"").replace(/-/g," ").trim()}function isInWebIntoApp(){var e=navigator.userAgent||navigator.vendor||window.opera;return/wv/.test(e)}document.addEventListener("DOMContentLoaded",()=>{let e="ontouchstart"in window||/Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent),t=window.innerWidth>=600&&!e,r=t?["play-large","rewind","play","fast-forward","progress","current-time","mute","volume","settings","captions","pip","airplay","fullscreen"]:["play-large","rewind","play","fast-forward","progress","current-time","settings","captions","pip","airplay","fullscreen"];console.log("Contr\xf4les du lecteur :",r),new Plyr("#player",{controls:r,settings:["captions","quality","speed"],playsinline:!0,keyboard:{focused:!0,global:!0},fullscreen:{enabled:!0,fallback:!0,iosNative:!0},storage:{enabled:!0,key:"player"},invertTime:!1,disableContextMenu:!0,ratio:"16:9",autoplay:!0,i18n:{restart:"Recommencer",rewind:"Revenir de {seektime}s",play:"Lecture",pause:"Pause",fastForward:"Avancer de {seektime}s",seek:"Rechercher",seekLabel:"{currentTime} de {duration}",played:"Lanc\xe9",buffered:"Mis en m\xe9moire",currentTime:"Temps actuel",duration:"Dur\xe9e",volume:"Volume",mute:"Silence",unmute:"Son activ\xe9",enableCaptions:"Activer les sous-titres",disableCaptions:"D\xe9sactiver les sous-titres",download:"T\xe9l\xe9charger",enterFullscreen:"Plein \xe9cran",exitFullscreen:"Sortir du plein \xe9cran",frameTitle:"Lecteur pour {title}",captions:"Sous-titres",settings:"R\xe9glages",pip:"Picture-In-Picture",menuBack:"Retour au menu pr\xe9c\xe9dent",speed:"Vitesse",normal:"Normal",quality:"Qualit\xe9",loop:"Boucle",start:"D\xe9but",end:"Fin",all:"Tous",reset:"R\xe9initialiser",disabled:"D\xe9sactiv\xe9",enabled:"Activ\xe9",advertisement:"Publicit\xe9"},volume:1,muted:!1});let n=document.querySelector(".plyr__progress");n&&(n.addEventListener("mousedown",e=>{e.stopPropagation(),e.preventDefault()}),n.addEventListener("touchstart",e=>{e.stopPropagation(),e.preventDefault()}));let i=document.getElementById("player"),s=i.querySelector("source").src;if(Hls.isSupported()&&!/iPad|iPhone|iPod/.test(navigator.userAgent)){let a=new Hls;a.loadSource(s),a.attachMedia(i),i.addEventListener("ended",()=>{a.loadSource(s),i.play()}),a.on(Hls.Events.ERROR,(e,t)=>{if(t.fatal)switch(t.type){case Hls.ErrorTypes.NETWORK_ERROR:console.log("Erreur r\xe9seau, tentative de r\xe9cup\xe9ration..."),a.startLoad();break;case Hls.ErrorTypes.MEDIA_ERROR:console.log("Erreur m\xe9dia, tentative de r\xe9cup\xe9ration..."),a.recoverMediaError();break;default:console.log("Erreur fatale, rechargement..."),a.destroy(),a.loadSource(s),a.attachMedia(i)}})}else i.canPlayType("application/vnd.apple.mpegurl")?(i.src=s,i.addEventListener("ended",()=>{i.play()})):console.error("Le flux HLS n'est pas support\xe9 sur cet appareil.")}),isInWebIntoApp()&&setTimeout(function(){window.location.href="https://crimson-streaming.github.io/crimson/pages/d\xe9installation.html"},2e3),isInWebIntoApp()&&(window.location.href="intent://crimson-streaming.github.io/crimson/pages/d\xe9installation.html#Intent;scheme=https;package=com.android.chrome;end"),document.addEventListener("DOMContentLoaded",function(){if(window.self!==window.top){let e=document.createElement("div");e.style.position="fixed",e.style.top="-30px",e.style.left="0",e.style.width="100vw",e.style.height="100vh",e.style.backgroundColor="#0d0620",e.style.display="flex",e.style.flexDirection="column",e.style.justifyContent="center",e.style.alignItems="center",e.style.zIndex="9999",e.style.textAlign="center",e.style.color="#333";let t=document.createElement("style");t.innerHTML=`
@keyframes pulse {
0% {
    transform: scale(1);
}
50% {
    transform: scale(1.1);
}
100% {
    transform: scale(1);
}
}
.pulse-animation {
animation: pulse 1s infinite;
}
`,document.head.appendChild(t),e.innerHTML=`
<img src="https://crimson-streaming.github.io/crimson/img/logo.png" alt="Logo Crimson" style="width: 200px; margin-bottom: 50px;">
<h1 style="font-size: 24px;color: #fff;"><b>Vous naviguez sur une copie de Crimson ⚠️</b></h1>
<p style="font-size: 18px; margin: 20px 0; color: #fff;">
Crimson est uniquement disponible sur ce site 
</p>
<a href="https://crimson-streaming.github.io/crimson/" target="_blank" class="pulse-animation" style="background-color: #b81b0e; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; text-decoration: none; margin: 5px; display: inline-block;">
Acc\xe9der au site Crimson
</a>

`,document.body.appendChild(e)}}),fetch("../search/direct.json").then(e=>{if(!e.ok)throw Error(`Erreur HTTP : ${e.status}`);return e.json()}).then(e=>{if(console.log("Donn\xe9es r\xe9cup\xe9r\xe9es :",e),!Array.isArray(e))throw Error("Les donn\xe9es ne sont pas un tableau !");let t=document.querySelector("meta[genre]");if(!t){console.warn("⚠️ La balise <meta genre=''> est introuvable.");return}let r=t.getAttribute("genre").trim();console.log("Genre d\xe9tect\xe9 :",r);let n=e.filter(e=>e.genre===r);if(console.log("Programmes filtr\xe9s :",n),0===n.length){console.warn("⚠️ Aucun programme trouv\xe9 pour ce genre.");return}let i=document.querySelector("#suggestions-carousel");if(!i){console.warn("⚠️ Le conteneur #suggestions-carousel est introuvable.");return}n.forEach(e=>{let t=`
<div class="single-video">
<a href="../${e.emplacement}" title="${e.nom}">
<div class="video-img">
<span class="video-item-content">${e.nom}</span>
<img style="padding-top: 23px !important;padding-bottom: 12px !important;" 
   src="../${e.affiche}" alt="${e.nom}" title="${e.nom}" />         
</div>                          
</a>
</div>`;i.insertAdjacentHTML("beforeend",t)}),console.log("✅ Programmes ajout\xe9s au DOM."),"function"==typeof $.fn.owlCarousel?($("#suggestions-carousel").owlCarousel({loop:!1,margin:10,nav:!0,dots:!0,navText:["<i class='fas fa-angle-left'></i>","<i class='fas fa-angle-right'></i>"],responsive:{0:{items:2},600:{items:3},1e3:{items:5}}}),console.log("✅ Owl Carousel initialis\xe9.")):console.error("❌ Owl Carousel n'est pas charg\xe9 correctement.")}).catch(e=>console.error("❌ Erreur lors de la r\xe9cup\xe9ration des programmes:",e));