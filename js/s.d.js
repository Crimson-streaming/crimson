fetch('../search/direct.json').then(response=>{if(!response.ok){throw new Error(`HTTP error! Status: ${response.status}`)}
return response.json()}).then(data=>{let genreMeta=document.querySelector('meta[genre]');if(!genreMeta){console.error("Balise <meta genre='...'> non trouvée !");return}
let genre=genreMeta.getAttribute('genre').trim();let programmesFiltres=data.filter(item=>item.genre===genre);let container=document.querySelector('#suggestions-carousel');if(!container)return;programmesFiltres.forEach(programme=>{let programmeHTML=`
          <div class="single-video">
            <a href="../${programme.emplacement}" title="${programme.nom}">
              <div class="video-img"> 
                <span class="video-item-content">${programme.nom}</span>         
                <img src="../${programme.affiche}" title="${programme.nom}" alt="${programme.nom}" style="padding-top: 23px !important; padding-bottom: 12px !important;">         
              </div>       
            </a>
          </div>`;container.insertAdjacentHTML('beforeend',programmeHTML)});if(typeof $.fn.owlCarousel==='function'){$("#suggestions-carousel").owlCarousel({loop:!1,margin:10,nav:!0,dots:!0,navText:["<i class='fas fa-angle-left'></i>","<i class='fas fa-angle-right'></i>"],responsive:{0:{items:2},600:{items:3},1000:{items:5}}})}else{console.error("Owl Carousel n'est pas chargé correctement.")}}).catch(error=>console.error('Erreur lors de la récupération des programmes:',error));