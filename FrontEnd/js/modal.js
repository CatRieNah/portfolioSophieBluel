import { getWorks } from "./index.js"
const galleryModal = document.querySelector(".gallery-modal")
const modifEvent = document.querySelector(".modif")
const modalContainer = document.querySelector(".modal-container")
const modalWrapper = document.querySelector(".modal-wrapper")
async function displayGalleryModal(){
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

//Afficher la fenêtre modale
modifEvent.addEventListener("click",()=>{
    modalContainer.style.display = "flex"
    
})
// fermer la fenetre modale
modalContainer.addEventListener("click",(event)=>{
    if(event.target.classList.contains("modal-container")|| event.target.classList.contains("fa-xmark")){
        modalContainer.style.display = "none"

    }
})
//Suppression des travaux
const token = window.localStorage.getItem("token")
console.log(token)
async function deleteWorks(){
    await displayGalleryModal()
    const trashAll = document.querySelectorAll(".fa-trash-can")
    trashAll.forEach(trash => {
        trash.addEventListener("click",async (event)=>{
            console.log(event.target.id)
            const trashId = event.target.id
            if(trashId){
                const response = await fetch(`http://localhost:5678/api/works/${trashId}`,{
                    method: "DELETE",
                    headers: {"Authorization": `Bearer ${token} `}
                })
                if(response.ok){
                   console.log("image supprimée")
                   // Suppression dans la modale
                    const figureModal = document.querySelectorAll(".gallery-modal figure");
                    figureModal.forEach(figure => {
                        if (figure.id === trashId) {
                            figure.remove(); // Supprimer dans la modale
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

