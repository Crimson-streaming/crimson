const itemsPerPage=48;let currentPage=1,films=[];async function loadFilms(){try{let e=await fetch("search/f.json");films=await e.json(),renderFilms(currentPage),renderPagination()}catch(n){console.error("Erreur lors du chargement des films :",n)}}function renderFilms(e){let n=(e-1)*48,i=films.slice(n,n+48),r=document.getElementById("movies-container");r.innerHTML="",i.forEach(e=>{r.innerHTML+=`
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12 col-6">
        <div class="single-video">
            <a href="${e.emplacement}" title="${e.nom}">
                <div class="video-img">
                    <span class="video-item-content">${e.nom}</span>
                    <img src="${e.affiche}" alt="${e.nom}" >
                </div>
            </a>
        </div>
    </div>
`})}function renderPagination(){let e=Math.ceil(films.length/48),n=document.getElementById("pagination-links");n.innerHTML="";let i=Math.max(1,currentPage-Math.floor(5.5)),r=Math.min(e,i+11-1);r-i<10&&(i=Math.max(1,r-11+1)),n.innerHTML+=`
<li class="${1===currentPage?"disabled":""}">
    <a class="prev page-numbers" href="#" onclick="changePage(${currentPage-1})"><i class="fa fa-caret-left"></i></a>
</li>
`;for(let a=i;a<=r;a++)n.innerHTML+=`
    <li class="${a===currentPage?"active":""}">
        <a class="page-numbers" href="#" onclick="changePage(${a})">${a}</a>
    </li>
`;n.innerHTML+=`
<li class="${currentPage===e?"disabled":""}">
    <a class="next page-numbers" href="#" onclick="changePage(${currentPage+1})"><i class="fa fa-caret-right"></i></a>
</li>
`}function changePage(e){let n=Math.ceil(films.length/48);e<1||e>n||(renderFilms(currentPage=e),renderPagination())}let filteredFilms=[];async function loadFilms(){try{let e=await fetch("search/data.json");filteredFilms=films=await e.json();let n=getURLParameter("genre");n?filterByGenre(n):(renderFilms(currentPage),renderPagination())}catch(i){console.error("Erreur lors du chargement des films :",i)}}function getURLParameter(e){let n=new URLSearchParams(window.location.search);return n.get(e)}function renderFilms(e){let n=(e-1)*48,i=filteredFilms.slice(n,n+48),r=document.getElementById("movies-container");r.innerHTML="",i.forEach(e=>{r.innerHTML+=`
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12 col-6">
        <div class="single-video">
            <a href="${e.emplacement}" title="${e.nom}">
                <div class="video-img">
                    <span class="video-item-content">${e.nom}</span>
                    <img src="${e.affiche}" alt="${e.nom}">
                </div>
            </a>
        </div>
    </div>
`})}function renderPagination(){let e=Math.ceil(filteredFilms.length/48),n=document.getElementById("pagination-links");n.innerHTML="";let i=Math.max(1,currentPage-Math.floor(5.5)),r=Math.min(e,i+11-1);r-i<10&&(i=Math.max(1,r-11+1)),n.innerHTML+=`
<li class="${1===currentPage?"disabled":""}">
    <a class="prev page-numbers" href="#" onclick="changePage(${currentPage-1})"><i class="fa fa-caret-left"></i></a>
</li>
`;for(let a=i;a<=r;a++)n.innerHTML+=`
    <li class="${a===currentPage?"active":""}">
        <a class="page-numbers" href="#" onclick="changePage(${a})">${a}</a>
    </li>
`;n.innerHTML+=`
<li class="${currentPage===e?"disabled":""}">
    <a class="next page-numbers" href="#" onclick="changePage(${currentPage+1})"><i class="fa fa-caret-right"></i></a>
</li>
`}function changePage(e){let n=Math.ceil(filteredFilms.length/48);e<1||e>n||(renderFilms(currentPage=e),renderPagination())}function filterByGenre(e){if("all"===e)filteredFilms=films;else{let n=normalizeGenre(e);filteredFilms=films.filter(e=>e.genre.split(", ").map(normalizeGenre).includes(n))}renderFilms(currentPage=1),renderPagination()}function getQueryParam(e){let n=new URLSearchParams(window.location.search);return n.get(e)}function setSelectedGenre(){let e=getQueryParam("genre");if(e){let n=document.getElementById("genre-filter");n.value=e,filterByGenre(e)}}function applyFilter(){let e=document.getElementById("filter_list").value;filteredFilms="###"===e?[...films].sort((e,n)=>e.nom.localeCompare(n.nom)):"##"===e?[...films].sort(()=>Math.random()-.5):[...films],renderFilms(currentPage),renderPagination()}function normalizeGenre(e){return({"Science Fiction":"Science-Fiction","Science-fiction":"Science-Fiction","Science-Fiction & Fantastique":"Science-Fiction",Fantastique:"Fantasy","Epouvante-horreur":"Horreur",Adventure:"Aventure",Comedy:"Com\xe9die",Familial:"Famille","Action & Adventure":"Action","War & Politics":"Guerre",Historique:"Histoire",Musical:"Musique",Crime:"Policier"})[e]||e}document.addEventListener("DOMContentLoaded",()=>{setSelectedGenre(),loadFilms(),document.getElementById("filter_list").addEventListener("change",applyFilter)});