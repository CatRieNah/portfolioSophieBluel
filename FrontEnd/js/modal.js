import { getWorks } from "./index.js"
const galleryModal = document.querySelector(".gallery-modal")
const modifEvent = document.querySelector(".modif")
const modalContainer = document.querySelector(".modal-container")
const modalWrapper = document.querySelector(".modal-wrapper")
async function displayGalleryModal(){
    const works = await getWorks()
    works.forEach(work => {
        const figure = document.createElement("figure")
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
async function deleteWork(){
    await displayGalleryModal()

}
deleteWork()