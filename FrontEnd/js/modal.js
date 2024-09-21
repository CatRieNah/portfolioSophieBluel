import { getWorks } from "./index.js"
const galleryModal = document.querySelector(".gallery-modal")
const containerModal = document.querySelector(".modal-container")
const modalWrapper =document.querySelector(".modal-wrapper")
const xMark =document.querySelector(".fa-xmark")
//affichage des photos dans modale
async function displayWorksInModal() {
    const works = await getWorks()
    works.forEach(work=> {
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        img.src = work.imageUrl
        img.alt = work.title
        const span = document.createElement("span")
        const icone = document.createElement("i")
        icone.classList.add("fa-solid","fa-trash-can")
        span.appendChild(icone)
        figure.appendChild(img)
        figure.appendChild(span)
        galleryModal.appendChild(figure)
    });
}
displayWorksInModal()
// Ouvrir la fenêtre modale
document.querySelector(".modif p").addEventListener("click",()=>{
    containerModal.style.display = "flex"
})
//Fermer la fenêtre modale
containerModal.addEventListener("click",(event)=>{
    if(event.target.className !== "fa-solid fa-xmark" && event.target.className !== "modal-container"){
        return
    }else{
        containerModal.style.display = "none"
    }
})

