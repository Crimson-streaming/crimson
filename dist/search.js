async function showSuggestions(r){const n=document.getElementById("search_output");if(n.innerHTML="",!!r)try{const t=await fetch("../search/d.json");if(!t.ok)throw new Error("Erreur r\xE9seau");const i=await t.json(),c=normalizeString(r),o=i.filter(e=>normalizeString(e.nom).includes(c)).slice(0,48);o.length>0?o.forEach(e=>{const s=document.createElement("div");s.classList.add("single-video"),s.innerHTML=`
                    <a href="${e.emplacement}">
                        <div class="video-img">
                            <span class="video-item-content">${e.nom}</span>
                            <img src="${e.affiche}" alt="${e.nom}">
                        </div>
                    </a>
                `,n.appendChild(s)}):n.innerHTML="<p>Aucun r\xE9sultat trouv\xE9.</p>"}catch(t){n.innerHTML="<p>Une erreur est survenue lors du chargement des donn\xE9es.</p>",console.error("Erreur de recherche:",t)}}function normalizeString(r){return r.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/['’]/g,"").replace(/-/g," ").trim()}
