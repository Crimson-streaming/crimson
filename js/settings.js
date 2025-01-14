// Fonction pour récupérer les cookies stockés dans le localStorage
           function getCookieCount() {
            const cookies = Object.keys(localStorage);
            return cookies.length;
        }

        // Met à jour l'affichage du nombre de cookies
        function updateCookieCount() {
            const count = getCookieCount();
            document.getElementById('cookie-count').textContent = count;
        }


        // Initialisation : mettre à jour le compteur au chargement
        updateCookieCount();






    function deleteCookies() {
    // Supprimer tous les cookies
    document.cookie.split(";").forEach(function(cookie) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    });

    // Supprimer les données dans le localStorage
    localStorage.clear();

    // Remettre le compteur de cookies à zéro
    document.getElementById("cookie-count").textContent = "0";



        // Affichage d'une alerte personnalisée
        showCustomAlert("Tous les cookies ont été supprimés avec succès !");
    }

    // Fonction pour afficher une alerte personnalisée
    function showCustomAlert(message) {
        // Création de l'élément d'alerte
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('custom-alert');

        // Ajout du contenu de l'alerte (icône + message)
        alertDiv.innerHTML = `
            <img src="img/assets/icon-sweetalert.png" alt="Success" class="icon">
            <span>${message}</span>
        `;

        // Ajout de l'alerte au corps de la page
        document.body.appendChild(alertDiv);

        // Suppression de l'alerte après 3 secondes
        setTimeout(() => {
            alertDiv.remove();
        }, 3000); // Temps en millisecondes
    }

    

// Charger le nom stocké au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    const storedName = localStorage.getItem("profileName");
    const profileNameElement = document.getElementById("profile-name");

    // Si un nom est stocké, on l'affiche, sinon on affiche "Utilisateur"
    profileNameElement.textContent = storedName ? storedName : "Utilisateur";
});

// Fonction pour modifier le nom avec SweetAlert
function editName() {
    Swal.fire({
        title: "Modifier votre nom",
        input: "text",
        inputPlaceholder: "Entrez votre nouveau nom",
        showCancelButton: true,
        confirmButtonText: "Enregistrer",
        cancelButtonText: "Annuler",
        background: "#4b0076", // Couleur de fond
        color: "#ffffff", // Couleur du texte
        inputAttributes: {
            autocomplete: "off" // Désactiver les suggestions
        },
        customClass: {
            popup: 'custom-popup', // Style personnalisé pour la popup
            confirmButton: 'custom-confirm-btn', // Style pour le bouton
            input: 'custom-input' // Style pour l'input
        },
        preConfirm: () => {
            const inputElement = Swal.getInput(); // Récupère l'élément input
            if (!inputElement.value) {
                // Appliquer la bordure rouge et l'animation de vibration
                inputElement.classList.add("error-border", "shake");

                // Réinitialisation après 1 seconde
                setTimeout(() => {
                    inputElement.classList.remove("error-border", "shake");
                }, 1000);

                return false; // Bloque la fermeture de la popup
            } else {
                return inputElement.value; // Retourne la valeur saisie si elle est valide
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newName = result.value;

            // Enregistrer le nouveau nom dans le localStorage
            localStorage.setItem("profileName", newName);

            // Mettre à jour l'affichage
            document.getElementById("profile-name").textContent = newName;

            Swal.fire({
                title: "Succès !",
                text: "Votre nom a été mis à jour avec succès.",
                icon: "success",
                background: "#4b0076",
                color: "#ffffff",
                customClass: {
                    popup: 'custom-popup' // Réutiliser les styles
                }
            });
        }
    });
}


