(()=>{document.addEventListener("DOMContentLoaded",async function(){try{let t=document.title,p=/Regarder\s(.+?)\sen\sstreaming/,o=t.match(p);if(!o||!o[1]){console.error("Impossible d'extraire le nom du film depuis le titre HTML.");return}let n=o[1].trim();console.log("Nom du film extrait :",n);let i=await(await fetch("../search/data.json")).json(),f=await(await fetch("../search/f.json")).json(),l=i.find(e=>e.nom===n);if(!l){console.error("Film introuvable dans data.json :",n);return}let c=l.genre.split(",").map(e=>e.trim());console.log("Genres du film :",c);let m=i.filter(e=>e.nom!==n).map(e=>{let r=e.genre.split(",").map(a=>a.trim()).filter(a=>c.includes(a));return{...e,commonGenresCount:r.length}}).filter(e=>e.commonGenresCount>0).sort((e,s)=>s.commonGenresCount-e.commonGenresCount).slice(0,10);console.log("Films recommand\xE9s :",m);let d=m.map(e=>{let s=f.find(r=>r.nom===e.nom);return{...e,emplacement:s?s.emplacement.split("/").pop():null}}).filter(e=>e.emplacement);console.log("Films avec emplacements :",d);let u=document.getElementById("suggestions-carousel");if(!u){console.error("Le conteneur du carousel n'a pas \xE9t\xE9 trouv\xE9.");return}d.forEach(e=>{let s=`
                <div class="item">
                    <div class="single-video">
                        <a href="${e.emplacement}" title="${e.nom}">
                            <div class="video-img"> 
                                <span class="video-item-content">${e.nom}</span>
                                <img src="${e.affiche}" alt="${e.nom}" title="${e.nom}">         
                            </div>       
                        </a>
                    </div>
                </div>`;u.innerHTML+=s}),$(".owl-carousel").owlCarousel({loop:!1,margin:10,nav:!0,navText:['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],responsive:{0:{items:2,slideBy:2,margin:15},480:{items:3,slideBy:3},768:{items:4,slideBy:4},991:{items:5,slideBy:5},1198:{items:7,slideBy:7}}})}catch(t){console.error("Erreur lors du traitement :",t)}});})();
//# sourceMappingURL=suggestions.js.map
