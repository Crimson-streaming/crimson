document.addEventListener("DOMContentLoaded",async function(){try{const o=document.title,g=/Regarder\s(.+?)\sen\sstreaming/,r=o.match(g);if(!r||!r[1]){console.error("Impossible d'extraire le nom du film depuis le titre HTML.");return}const t=r[1].trim();console.log("Nom du film extrait :",t);let s=await(await fetch("../search/data.json")).json();s=s.sort(()=>Math.random()-.5);const l=s.find(e=>e.nom===t);if(!l){console.error("Film introuvable dans data.json :",t);return}const m=l.genre.split(",").map(e=>e.trim());console.log("Genres du film :",m);const c=s.filter(e=>e.nom!==t).map(e=>{const i=e.genre.split(",").map(a=>a.trim()).filter(a=>m.includes(a));return{...e,commonGenresCount:i.length}}).filter(e=>e.commonGenresCount>0).sort((e,n)=>n.commonGenresCount-e.commonGenresCount).slice(0,10);console.log("Films recommand\xE9s :",c);const d=c.map(e=>{const n=s.find(i=>i.nom===e.nom);return{...e,emplacement:n?n.emplacement.split("/").pop():null}}).filter(e=>e.emplacement);console.log("Films avec emplacements :",d);const u=document.getElementById("suggestions-carousel");if(!u){console.error("Le conteneur du carousel n'a pas \xE9t\xE9 trouv\xE9.");return}d.forEach(e=>{const n=`
                <div class="item">
                    <div class="single-video">
                        <a href="${e.emplacement}" title="${e.nom}">
                            <div class="video-img"> 
                                <span class="video-item-content">${e.nom}</span>
                                <img src="${e.affiche}" alt="${e.nom}" title="${e.nom}">         
                            </div>       
                        </a>
                    </div>
                </div>`;u.innerHTML+=n}),$(".owl-carousel").owlCarousel({loop:!1,margin:10,nav:!0,navText:['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],responsive:{0:{items:2,slideBy:2,margin:15},480:{items:3,slideBy:3},768:{items:4,slideBy:4},991:{items:5,slideBy:5},1198:{items:7,slideBy:7}}})}catch(o){console.error("Erreur lors du traitement :",o)}});
