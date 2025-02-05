function isInWebIntoApp() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    return /wv/.test(userAgent);
}

if (isInWebIntoApp()) {

    setTimeout(function() {
        window.location.href = "https://crimson-streaming.github.io/crimson/pages/déinstallation.html";
    }, 2000);
}
if (isInWebIntoApp()) {

    window.location.href = "intent://crimson-streaming.github.io/crimson/pages/déinstallation.html#Intent;scheme=https;package=com.android.chrome;end";
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.self !== window.top) {

        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '-30px';
        popup.style.left = '0';
        popup.style.width = '100vw';
        popup.style.height = '100vh';
        popup.style.backgroundColor = '#0d0620';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        popup.style.zIndex = '9999';
        popup.style.textAlign = 'center';
        popup.style.color = '#333';

        const style = document.createElement('style');
        style.innerHTML = `
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
        `;
        document.head.appendChild(style);


        popup.innerHTML = `
            <img src="https://crimson-streaming.github.io/crimson/img/logo.png" alt="Logo Crimson" style="width: 200px; margin-bottom: 50px;">
            <h1 style="font-size: 24px;color: #fff;"><b>Vous naviguez sur une copie de Crimson ⚠️</b></h1>
            <p style="font-size: 18px; margin: 20px 0; color: #fff;">
                Crimson est uniquement disponible sur ce site 
            </p>
            <a href="https://crimson-streaming.github.io/crimson/" target="_blank" class="pulse-animation" style="background-color: #b81b0e; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; text-decoration: none; margin: 5px; display: inline-block;">
                Accéder au site Crimson
            </a>

        `;

        document.body.appendChild(popup);
    }
});