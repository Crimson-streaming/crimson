function isInWebIntoApp(){var e=navigator.userAgent||navigator.vendor||window.opera;return/wv/.test(e)}isInWebIntoApp()&&setTimeout(function(){window.location.href="https://crimson-streaming.github.io/crimson/pages/d\xE9installation.html"},2e3),isInWebIntoApp()&&(window.location.href="intent://crimson-streaming.github.io/crimson/pages/d\xE9installation.html#Intent;scheme=https;package=com.android.chrome;end"),document.addEventListener("DOMContentLoaded",function(){if(window.self!==window.top){const e=document.createElement("div");e.style.position="fixed",e.style.top="-30px",e.style.left="0",e.style.width="100vw",e.style.height="100vh",e.style.backgroundColor="#0d0620",e.style.display="flex",e.style.flexDirection="column",e.style.justifyContent="center",e.style.alignItems="center",e.style.zIndex="9999",e.style.textAlign="center",e.style.color="#333";const t=document.createElement("style");t.innerHTML=`
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
            <h1 style="font-size: 24px;color: #fff;"><b>Vous naviguez sur une copie de Crimson \u26A0\uFE0F</b></h1>
            <p style="font-size: 18px; margin: 20px 0; color: #fff;">
                Crimson est uniquement disponible sur ce site 
            </p>
            <a href="https://crimson-streaming.github.io/crimson/" target="_blank" class="pulse-animation" style="background-color: #b81b0e; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; text-decoration: none; margin: 5px; display: inline-block;">
                Acc\xE9der au site Crimson
            </a>

        `,document.body.appendChild(e)}});
