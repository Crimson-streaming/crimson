async function showSuggestions(e){let t=document.getElementById("search_output");if(t.innerHTML="",e)try{let n=await fetch("../search/d.json");if(!n.ok)throw Error("Erreur r\xe9seau");let i=await n.json(),a=normalizeString(e),r=i.filter(e=>normalizeString(e.nom).includes(a)),s=r.slice(0,48);s.length>0?s.forEach(e=>{let n=document.createElement("div");n.classList.add("single-video"),n.innerHTML=`
    <a href="${e.emplacement}">
        <div class="video-img">
            <span class="video-item-content">${e.nom}</span>
            <img src="${e.affiche}" alt="${e.nom}">
        </div>
    </a>
`,t.appendChild(n)}):t.innerHTML="<p>Aucun r\xe9sultat trouv\xe9.</p>"}catch(l){t.innerHTML="<p>Une erreur est survenue lors du chargement des donn\xe9es.</p>",console.error("Erreur de recherche:",l)}}function normalizeString(e){return e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/['’]/g,"").replace(/-/g," ").trim()}function isInWebIntoApp(){var e=navigator.userAgent||navigator.vendor||window.opera;return/wv/.test(e)}function gtag(){dataLayer.push(arguments)}document.addEventListener("DOMContentLoaded",()=>{let e=window.innerWidth>=600,t=e?["play-large","rewind","play","fast-forward","progress","current-time","mute","volume","settings","captions","pip","airplay","fullscreen"]:["play-large","rewind","play","fast-forward","progress","current-time","settings","captions","pip","airplay","fullscreen"],n=new Plyr("#player",{controls:t,settings:["captions","quality","speed"],playsinline:!0,keyboard:{focused:!0,global:!0},fullscreen:{enabled:!0,fallback:!0,iosNative:!0},storage:{enabled:!0,key:"player"},invertTime:!1,disableContextMenu:!0,ratio:"16:9",i18n:{restart:"Recommencer",rewind:"Revenir de {seektime}s",play:"Lecture",pause:"Pause",fastForward:"Avancer de {seektime}s",seek:"Rechercher",seekLabel:"{currentTime} de {duration}",played:"Lanc\xe9",buffered:"Mis en m\xe9moire",currentTime:"Temps actuel",duration:"Dur\xe9e",volume:"Volume",mute:"Silence",unmute:"Son activ\xe9",enableCaptions:"Activer les sous-titres",disableCaptions:"D\xe9sactiver les sous-titres",download:"T\xe9l\xe9charger",enterFullscreen:"Plein \xe9cran",exitFullscreen:"Sortir du plein \xe9cran",frameTitle:"Lecteur pour {title}",captions:"Sous-titres",settings:"R\xe9glages",pip:"Picture-In-Picture",menuBack:"Retour au menu pr\xe9c\xe9dent",speed:"Vitesse",normal:"Normal",quality:"Qualit\xe9",loop:"Boucle",start:"D\xe9but",end:"Fin",all:"Tous",reset:"R\xe9initialiser",disabled:"D\xe9sactiv\xe9",enabled:"Activ\xe9",advertisement:"Publicit\xe9"},volume:1,muted:!1}),i=document.getElementById("player"),a=document.getElementById("video-loader"),r=i.querySelector("source").src,s=`videoCurrentTime_${encodeURIComponent(r)}`,l=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;l||n.on("ready",()=>{let e=document.querySelector(".plyr__controls");if(!e)return;let t=e.querySelector('[data-plyr="pip"]');if(t){let n=document.createElement("button");n.classList.add("plyr__control"),n.id="castButton",n.innerHTML=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100" height="100">
    <path d="M447.8 64H64c-23.6 0-42.7 19.1-42.7 42.7v63.9H64v-63.9h383.8v298.6H298.6V448H448c23.6 0 42.7-19.1 42.7-42.7V106.7C490.7 83.1 471.4 64 447.8 64zM21.3 383.6L21.3 383.6l0 63.9h63.9C85.2 412.2 56.6 383.6 21.3 383.6L21.3 383.6zM21.3 298.6V341c58.9 0 106.6 48.1 106.6 107h42.7C170.7 365.6 103.7 298.7 21.3 298.6zM213.4 448h42.7c-.5-129.5-105.3-234.3-234.8-234.6l0 42.4C127.3 255.6 213.3 342 213.4 448z" fill="white"/>
</svg>
`,t.insertAdjacentElement("afterend",n);let i=document.getElementById("castButton");i?i.addEventListener("click",()=>{let e=cast.framework.CastContext.getInstance();e.getCastState()||e.setOptions(castOptions);let t=e.getCastState();t===cast.framework.CastState.CONNECTING||t===cast.framework.CastState.CONNECTED?m():e.requestSession()}):console.error("Le bouton Cast n'a pas \xe9t\xe9 trouv\xe9.")}});let o=()=>{let e=localStorage.getItem(s);e&&(i.currentTime=parseFloat(e))},c=e=>{a.style.display=e?"block":"none"};if(c(!1),i.addEventListener("pause",()=>{c(!1)}),i.addEventListener("play",()=>{c(!0)}),Hls.isSupported()){let d=new Hls;d.loadSource(r),d.attachMedia(i),d.on(Hls.Events.MANIFEST_PARSED,()=>c(!1)),d.on(Hls.Events.BUFFER_STALLED,()=>c(!0)),i.addEventListener("timeupdate",()=>{localStorage.setItem(s,i.currentTime)}),i.addEventListener("waiting",()=>c(!0)),i.addEventListener("playing",()=>c(!1)),o()}else i.canPlayType("application/vnd.apple.mpegurl")?(i.src=r,i.addEventListener("loadeddata",()=>c(!1)),i.addEventListener("waiting",()=>c(!0)),i.addEventListener("timeupdate",()=>{localStorage.setItem(s,i.currentTime)}),o()):(console.error("HLS non support\xe9, ou aucun fallback compatible disponible."),c(!1));function u(){if("undefined"==typeof cast||!cast.framework){console.error("Google Cast Framework non disponible.");return}let e=cast.framework.CastContext.getInstance();e.setOptions({receiverApplicationId:chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,autoJoinPolicy:chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED}),e.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED,e=>{(e.sessionState===cast.framework.SessionState.SESSION_STARTED||e.sessionState===cast.framework.SessionState.SESSION_RESUMED)&&m()})}function m(){let e=cast.framework.CastContext.getInstance(),t=e.getCurrentSession();if(t){let n=document.querySelector("#player source"),i=n?n.src:null;if(i){let a=new chrome.cast.media.MediaInfo(i,"application/x-mpegURL");a.metadata=new chrome.cast.media.GenericMediaMetadata,a.metadata.title="CAST | Crimson";let r=new chrome.cast.media.LoadRequest(a);t.loadMedia(r).then(()=>console.log("Vid\xe9o diffus\xe9e avec succ\xe8s.")).catch(e=>console.error("Erreur de diffusion :",e))}}}window.__onGCastApiAvailable=function(e){e?u():console.error("API Google Cast non disponible.")}}),isInWebIntoApp()&&setTimeout(function(){window.location.href="https://crimson-streaming.github.io/crimson/pages/d\xe9installation.html"},2e3),isInWebIntoApp()&&(window.location.href="intent://crimson-streaming.github.io/crimson/pages/d\xe9installation.html#Intent;scheme=https;package=com.android.chrome;end"),document.addEventListener("DOMContentLoaded",function(){if(window.self!==window.top){let e=document.createElement("div");e.style.position="fixed",e.style.top="-30px",e.style.left="0",e.style.width="100vw",e.style.height="100vh",e.style.backgroundColor="#0d0620",e.style.display="flex",e.style.flexDirection="column",e.style.justifyContent="center",e.style.alignItems="center",e.style.zIndex="9999",e.style.textAlign="center",e.style.color="#333";let t=document.createElement("style");t.innerHTML=`
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

`,document.body.appendChild(e)}}),window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","G-7QZGKN17QX");const itemsPerPage=48;let currentPage=1;function loadWatchlist(){let e=JSON.parse(localStorage.getItem("watchlist"))||[];e.reverse(),renderFilms(e,currentPage),renderPagination(e)}function renderFilms(e,t){let n=(t-1)*48,i=e.slice(n,n+48),a=document.getElementById("movies-container");a.innerHTML="",i.length>0?i.forEach((e,t)=>{let i=document.createElement("div");i.classList.add("col-lg-2","col-md-3","col-sm-4","col-xs-12","col-6","single-video"),i.innerHTML=`
<div class="watchlist-item">
    <a href="#" title="Remove" onclick="removeFromWatchlist(${n+t})">
        <i class="fa fa-times"></i> Retirer
    </a>
</div>
<a href="${e.emplacement}" title="${e.nom}">
    <div class="video-img">
        <span class="video-item-content">${e.nom}</span>
        <img src="${e.affiche}" alt="${e.nom}" title="${e.nom}">
    </div>
</a>
`,a.appendChild(i)}):a.innerHTML="<p>Aucun film dans votre liste pour le moment.</p>"}function renderPagination(e){let t=Math.ceil(e.length/48),n=document.getElementById("pagination-links");n.innerHTML="";let i=Math.max(1,currentPage-Math.floor(5.5)),a=Math.min(t,i+11-1);if(a-i<10&&(i=Math.max(1,a-11+1)),t>1){n.innerHTML+=`
<li class="${1===currentPage?"disabled":""}">
<a class="prev page-numbers" href="#" onclick="changePage(${currentPage-1})"><i class="fa fa-caret-left"></i></a>
</li>
`;for(let r=i;r<=a;r++)n.innerHTML+=`
<li class="${r===currentPage?"active":""}">
    <a class="page-numbers" href="#" onclick="changePage(${r})">${r}</a>
</li>
`;n.innerHTML+=`
<li class="${currentPage===t?"disabled":""}">
<a class="next page-numbers" href="#" onclick="changePage(${currentPage+1})"><i class="fa fa-caret-right"></i></a>
</li>
`}}function changePage(e){let t=JSON.parse(localStorage.getItem("watchlist"))||[],n=Math.ceil(t.length/48);e<1||e>n||(renderFilms(t,currentPage=e),renderPagination(t))}function showCustomAlert(e){let t=document.createElement("div");t.classList.add("custom-alert"),t.innerHTML=`
<img src="img/assets/icon-sweetalert.png" alt="Success" class="icon">
${e}
`,document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}function removeFromWatchlist(e){let t=JSON.parse(localStorage.getItem("watchlist"))||[],n=t.length-1-e;t.splice(n,1),localStorage.setItem("watchlist",JSON.stringify(t)),loadWatchlist(),showCustomAlert("Supprim\xe9 avec succ\xe8s de votre liste")}function toggleWatchlist(e,t,n,i){let a=JSON.parse(localStorage.getItem("watchlist"))||[],r=a.findIndex(e=>e.nom===t);-1===r?(a.push({nom:t,affiche:n,emplacement:i}),localStorage.setItem("watchlist",JSON.stringify(a)),e.innerHTML='<i class="fa fa-check"></i>‎ Supprimer de ma liste',e.onclick=()=>toggleWatchlist(e,t,n,i)):(a.splice(r,1),localStorage.setItem("watchlist",JSON.stringify(a)),e.innerHTML='<i class="fa fa-plus"></i>‎ Ajouter \xe0 ma liste',e.onclick=()=>toggleWatchlist(e,t,n,i))}window.onload=loadWatchlist,$(document).bind("contextmenu",function(){return!1}),$(document).ready(function(){$(".video-shows-carousel").owlCarousel({loop:!1,margin:10,nav:!0,dots:!0,navText:["<i class='fas fa-angle-left'></i>","<i class='fas fa-angle-right'></i>"],responsive:{0:{items:1},600:{items:2},1e3:{items:""}}})}),document.querySelector("#regarder").addEventListener("click",function(e){var t=document.querySelector("#player");t.scrollIntoView({behavior:"smooth",block:"center"}),setTimeout(function(){t&&"undefined"!=typeof Plyr?new Plyr(t).play().catch(e=>{console.error("Erreur lors de la tentative de lecture automatique :",e)}):console.error("Le lecteur Plyr n’est pas d\xe9tect\xe9 ou n’a pas \xe9t\xe9 initialis\xe9 correctement.")},500)});