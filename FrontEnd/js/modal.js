import { getWorks } from "./index.js"
import { getCategories } from "./index.js"
import { displayWorks } from "./index.js"
const galleryModal = document.querySelector(".gallery-modal")
const modifEvent = document.querySelector(".modif")
const modalContainer = document.querySelector(".modal-container")
const listGallery = document.querySelector(".list_gallery")
const buttonInListGallery = document.querySelector(".list_gallery button")
const uploadGallery = document.querySelector(".upload_gallery")
const arrowLeft = document.querySelector(".fa-arrow-left")
async function displayGalleryModal(){
    galleryModal.innerHTML =""
    const works = await getWorks()
    works.forEach(work => {
        const figure = document.createElement("figure")
        figure.id = work.id
        const img = document.createElement("img")
        img.src = work.imageUrl
        img.alt = work.title
        const span = document.createElement("span")
        const icontrash = document.createElement("i")
        icontrash.classList.add("fa-solid","fa-trash-can")
        icontrash.id = work.id
        figure.appendChild(img)
        span.appendChild(icontrash)
        figure.appendChild(span)
        galleryModal.appendChild(figure)
    });
}

//Ouvrir la fenêtre modale gallerie
modifEvent.addEventListener("click",()=>{
    modalContainer.style.display ="flex"
})
//ouvrir la fenêtre Ajout photo
buttonInListGallery.addEventListener("click",()=>{
    uploadGallery.style.display = "flex"
    listGallery.style.display = "none"
})
//fermeture de la modale
modalContainer.addEventListener("click",(event)=>{
    if (event.target.classList.contains("fa-xmark") || event.target.classList.contains("modal-container")) {
        modalContainer.style.display = "none";

        // Réinitialise l'affichage des galeries pour la prochaine ouverture
        uploadGallery.style.display = "none"; // Cache la section d'ajout de photo
        listGallery.style.display = "block"; // Affiche la liste de la galerie
    }
})
// Retour sur la modale liste photo
arrowLeft.addEventListener("click",()=>{
    listGallery.style.display = "block"
    uploadGallery.style.display = "none"
})
// Ajout des catégories dans la balise select
const select = document.querySelector(".upload_gallery form select")
//Lorsque je fais addeventlistner sur select, il faut cliquer 3 fois pour afficher toutes les catégories, j'ai essayé si ça marche avec le clic sur modifier pour avancer l'affichage des catégories 
modifEvent.addEventListener("click",()=>{
    createOptionsSelect()
})
async function createOptionsSelect() {
    const categories = await getCategories()
    console.log(categories)
    categories.forEach(category => {
        const option = document.createElement("option")
        option.value = category.id
        option.textContent = category.name
        select.appendChild(option)
    });
}

//Suppression des travaux
const token = window.localStorage.getItem("token")
async function deleteWorks(){

    await displayGalleryModal()
    const trashAll = document.querySelectorAll(".fa-trash-can")
    trashAll.forEach(trash => {
        trash.addEventListener("click",async (event)=>{
            const trashId = event.target.id
            if(trashId){
                const response = await fetch(`http://localhost:5678/api/works/${trashId}`,{
                    method: "DELETE",
                    headers: {"Authorization": `Bearer ${token} `}
                })
                if(response.ok){
                   // Suppression dans la modale
                    const figureModal = document.querySelectorAll(".gallery-modal figure")
                    figureModal.forEach(figure => {
                        if (figure.id === trashId) {
                            figure.remove() // Supprimer dans la modale
                        }
                    })

                    // Suppression dans la galerie principale
                    const figureGallery = document.querySelectorAll(".gallery figure");
                    figureGallery.forEach(figure => {
                        if (figure.id === trashId) {
                            figure.remove(); // Supprimer dans la galerie principale
                        }
                    })
                }else{
                    console.error("Echec de suppression de l'image")
                }
            }else{
                console.error("L'élément cliqué n'a pas d'id")
            }
        })
    })
}
deleteWorks()
document.addEventListener("DOMContentLoaded", function() {
    // Sélectionner le champ de fichier
    const inputFile = document.querySelector(".add_gallery input[type='file']");

    // Vérification de l'existence de l'input de fichier
    if (inputFile) {
        inputFile.addEventListener("change", insertImages);
    } else {
        console.error("Input file not found!");
    }
});

// Définir la fonction insertImages en dehors de DOMContentLoaded pour la rendre accessible
function insertImages() {
    const inputFile = document.querySelector(".add_gallery input[type='file']");
    const files = inputFile ? inputFile.files : []; // Récupérer tous les fichiers sélectionnés

    if (files.length > 0) {
        // Parcourir tous les fichiers sélectionnés
        for (let i = 0; i < files.length; i++) {
            const file = files[i]; // Fichier actuel
            const reader = new FileReader(); // Créer un nouveau FileReader pour chaque fichier

            // Lorsqu'un fichier est chargé
            reader.onload = function(event) {
                // Créer un élément img
                const image = document.createElement("img");
                image.src = event.target.result; // Utiliser le résultat de FileReader
                image.style.width = "100%"; // Ajuster la taille de l'image

                // Ajouter l'image à la galerie
                const gallery = document.querySelector(".add_gallery");
                if (gallery) {
                    gallery.appendChild(image);
                } else {
                    console.error("Gallery element not found!");
                }
            };

            // Lire le fichier sélectionné
            reader.readAsDataURL(file); // Lire le fichier en tant que Data URL
        }

        // Cacher les éléments inutiles après la sélection
        const imageIcon = document.querySelector(".fa-image");
        const label = document.querySelector(".add_gallery label");
        const fileInput = document.querySelector(".add_gallery input[type='file']");
        const p = document.querySelector(".add_gallery p");

        if (imageIcon) imageIcon.style.display = "none";
        if (label) label.style.display = "none";
        if (fileInput) fileInput.style.display = "none";
        if (p) p.style.display = "none";
    }
}

// Envoi formulaire ajout photo
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image"); 
const formUpload = document.querySelector(".upload_gallery form");

formUpload.addEventListener("submit", (event) => {
    event.preventDefault();
    checkFields();
    addPicture();
});

async function addPicture() {
    try {
        const formData = new FormData(formUpload);
        const title = titleInput.value;
        const category = categoryInput.value;
        const image = imageInput.files.length;
        if (title && category && image) {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {"Authorization": `Bearer ${token}`},
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const addGallery = document.querySelector(".add_gallery");
                if (addGallery) {
                    addGallery.innerHTML = "";
                } else {
                    console.error("Gallery element not found for clearing!");
                }
                displayGalleryModal();
                displayWorks();
                resetForm();
            } else {
                throw new Error("Error:" + response.status);
            }
        }

    } catch (error) {
        console.error(error);
    }
}

// Vérification des champs
function checkFields() {
    const title = titleInput.value;
    const category = categoryInput.value;
    const image = imageInput.files.length;
    const submitButton = document.querySelector(".upload_gallery input[type='submit']");

    if (title && category && image > 0) {
        if (submitButton) {
            submitButton.style.backgroundColor = "#1D6154";
        }
    } else {
        if (submitButton) {
            submitButton.style.backgroundColor = "";
        }
    }
}

titleInput.addEventListener("input", checkFields);
categoryInput.addEventListener("input", checkFields);
imageInput.addEventListener("input", checkFields);

// Réinitialiser le formulaire
function resetForm() {
    // Réinitialiser les champs du formulaire
    titleInput.value = "";
    categoryInput.value = "";

    // Réinitialiser l'input de fichier en le recréant
    const newInputFile = document.createElement("input");
    newInputFile.type = "file";
    newInputFile.name = "image";
    newInputFile.id = "image";
    newInputFile.accept = "image/png,image/jpeg";

    // Remplacer l'ancien input par le nouveau
    const addGallery = document.querySelector(".add_gallery");
    if (addGallery) {
        addGallery.innerHTML = `
            <span><i class="fa-regular fa-image"></i></span>
            <label for="image">+ Ajouter photo</label>
        `;
        addGallery.appendChild(newInputFile);
        newInputFile.addEventListener("change", insertImages);
    } else {
        console.error("add_gallery element not found during reset!");
    }

    // Réinitialiser la couleur du bouton de soumission
    const submitButton = document.querySelector(".upload_gallery input[type='submit']");
    if (submitButton) {
        submitButton.style.backgroundColor = "";
    }

    // Vérifier les champs immédiatement après la réinitialisation
    checkFields();
}