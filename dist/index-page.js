function melangerTableau(e){for(let n=e.length-1;n>0;n--){const r=Math.floor(crypto.getRandomValues(new Uint32Array(1))[0]/4294967296*(n+1));[e[n],e[r]]=[e[r],e[n]]}return e}let filmsData=null;const COMBINAISONS_INTERDITES=[["Action","Romance"],["Horreur","Familial"],["Science-Fiction","Histoire"],["Guerre","Com\xE9die"],["Drame","Fantastique"],["Myst\xE8re","Animation"]];function estGenreAutorise(e){return!COMBINAISONS_INTERDITES.some(n=>n.every(r=>e.genre.includes(r)))}async function chargerFilms(){if(!filmsData)try{const e=await fetch(`search/p.json?nocache=${Date.now()}`);if(!e.ok)throw new Error(`Erreur HTTP : ${e.status}`);filmsData=await e.json()}catch(e){console.error("Erreur lors du chargement des donn\xE9es des films :",e),filmsData=[]}return filmsData}async function chargerFilmsAvecMelange(){return filmsData||(filmsData=await chargerFilms(),filmsData=melangerTableau(filmsData)),filmsData}async function chargerCategorie(e,n){try{const r=await chargerFilms(),i=melangerTableau(r).filter(o=>o.genre.includes(e)&&estGenreAutorise(o)).slice(0,16),a=document.querySelector(n);a.innerHTML=i.length?i.map(o=>`<div class="single-video">
                        <a href="${o.emplacement}" title="${o.nom}">
                            <div class="video-img">
                                <span class="video-item-content">${o.nom}</span>
                                <img src="${o.affiche}" alt="${o.nom}" loading="lazy">
                            </div>
                        </a>
                    </div>`).join(""):"<p>Aucun film trouv\xE9.</p>",reinitialiserOwlCarousel(n)}catch(r){console.error(`Erreur lors du chargement des films pour la cat\xE9gorie "${e}" :`,r),document.querySelector(n).innerHTML="<p>Erreur de chargement.</p>"}}const CATEGORIES=[{name:"Action",container:".video-carousel-action"},{name:"Drame",container:".video-carousel-drame"},{name:"Horreur",container:".video-carousel-horreur"},{name:"Animation",container:".video-carousel-animation"},{name:"Crime",container:".video-carousel-policier"},{name:"Guerre",container:".video-carousel-guerre"},{name:"Com\xE9die",container:".video-carousel-comedie"},{name:"Histoire",container:".video-carousel-histoire"},{name:"Romance",container:".video-carousel-romance"},{name:"Aventure",container:".video-carousel-aventure"},{name:"Fantastique",container:".video-carousel-fantastique"},{name:"Familial",container:".video-carousel-famille"},{name:"Myst\xE8re",container:".video-carousel-myst\xE8re"},{name:"Thriller",container:".video-carousel-thriller"},{name:"Science-Fiction",container:".video-carousel-science-fiction"}];async function chargerToutesLesCategories(){try{await Promise.all(CATEGORIES.map(({name:e,container:n})=>chargerCategorie(e,n))),console.log("Toutes les cat\xE9gories ont \xE9t\xE9 charg\xE9es avec succ\xE8s.")}catch(e){console.error("Erreur lors du chargement des cat\xE9gories :",e)}}document.addEventListener("DOMContentLoaded",chargerToutesLesCategories),window.addEventListener("popstate",chargerToutesLesCategories);const videoCarousel=document.getElementById("videoCarousel");fetch("search/films-en-tendance.json").then(e=>e.json()).then(e=>{e.forEach((n,r)=>{const i=document.createElement("div");i.classList.add("single-video"),i.innerHTML=`
            <a href="${n.link}" title="${n.title}">
                <div class="ranking-badge">${r+1}</div>
                <div class="video-img">
                    <span class="video-item-content">${n.title}</span>
                    <img src="${n.img}" alt="${n.title}" title="${n.title}">
                </div>
            </a>
        `,videoCarousel.appendChild(i)}),reinitialiserOwlCarousel("#videoCarousel")}).catch(e=>console.error("Erreur lors du chargement des films :",e));function reinitialiserOwlCarousel(e){const n=$(e);n.hasClass("owl-carousel")&&n.owlCarousel("destroy"),n.owlCarousel({nav:!0,margin:20,navText:['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],responsive:{0:{items:2,slideBy:2,margin:15},480:{items:3,slideBy:3},768:{items:4,slideBy:4},991:{items:5,slideBy:5},1198:{items:7,slideBy:7}}})}$(document).ready(function(){reinitialiserOwlCarousel("#videoCarousel")}),fetch("search/films-en-tendance.json").then(e=>e.json()).then(e=>{const n=document.querySelector(".view-all-video-area .row");e.forEach(r=>{const i=document.createElement("div");i.classList.add("col-lg-2","col-md-3","col-sm-4","col-xs-12","col-6"),i.innerHTML=`
                    <div class="single-video">
                        <a href="${r.link}" title="${r.title}">
                            <div class="video-img">
                                <span class="video-item-content">${r.title}</span>
                                <img src="${r.img}" alt="${r.title}" title="${r.title}">
                            </div>
                        </a>
                    </div>
                `,n.appendChild(i)})});
