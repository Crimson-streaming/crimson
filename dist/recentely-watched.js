(()=>{function c(){let i=document.getElementById("poster-watch-movie");if(!i)return;let t=i.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);if(!t)return;let e=t[2],n=document.querySelector('link[rel="canonical"]');if(!n)return;let l="film/"+n.getAttribute("href"),a={poster:e,path:l,title:l.split("/").pop().replace(/-/g," ").replace(".html","")},o=JSON.parse(localStorage.getItem("trendingMovies"))||[];o.some(r=>r.path===a.path)||(o.unshift(a),o.length>20&&o.pop(),localStorage.setItem("trendingMovies",JSON.stringify(o)))}function d(){let i=JSON.parse(localStorage.getItem("trendingMovies"))||[],s=document.querySelector(".video-shows-section.vfx-item-ptb"),t=document.getElementById("recently-watched");if(i.length===0){s&&(s.style.display="none");return}else s&&(s.style.display="block");t&&(t.innerHTML="",i.forEach(e=>{let n=document.createElement("div");n.classList.add("single-video"),n.innerHTML=`
            <a href="${e.path}" title="${e.title}">
                <div class="video-img">
                    <span class="video-item-content">${e.title}</span>
                    <img src="${e.poster}" alt="${e.title}" title="Movies-${e.title}">
                </div>
            </a>
        `,t.appendChild(n)}),$(document).ready(function(){$(".owl-carousel").owlCarousel({nav:!0,margin:20,navText:['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],responsive:{0:{items:2,slideBy:2},640:{items:3,slideBy:3},768:{items:4,slideBy:4},991:{items:5,slideBy:5},1198:{items:6,slideBy:6}}})}))}document.addEventListener("DOMContentLoaded",d);document.getElementById("poster-watch-movie")&&c();})();
//# sourceMappingURL=recentely-watched.js.map
