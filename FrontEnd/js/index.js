const gallery = document.querySelector(".gallery")
const portfolio = document.getElementById("portfolio")
const ul = document.createElement("ul")
portfolio.insertBefore(ul, gallery) // inserer le nouveau élément avant un élément existant défini
const li = document.createElement("li")
li.id = "All"
li.textContent = "Tous"
ul.appendChild(li)

//Récupération des travaux depuis le backend
export async function getWorks() {
    try {
        //appel fetch pour récupérer les données 
        const response = await fetch("http://localhost:5678/api/works")
        if(response.status === 200){
            const works = await response.json()
            return works
        }else{
            throw new Error("Unexpected Error"+response.status)
        }
    } catch (error) {
        console.error(error.message)
    }
}
//Affichage des travaux par JS
async function displayWorks() {
    const works = await getWorks()
    works.forEach(work => {
        const figure = document.createElement("figure")
        figure.id = work.id
        const img = document.createElement("img")
        img.src = work.imageUrl
        img.alt = work.title
        const figcaption = document.createElement("figcaption")
        figcaption.textContent = work.title
        figure.appendChild(img)
        figure.appendChild(figcaption)
        gallery.appendChild(figure)
    });
}
displayWorks(gallery)
// Récupération des catégories via les données récues, j'ai fais pour apprehender l'utilsation de set 
/*async function getCategories() {
    const works = await getWorks()
    const setCat = new Set()
    const categories = []
    works.forEach(work => {
        const categoriesName = work.category.name
        const categoriesId = work.category.id
        setCat.add(categoriesId)
        setCat.add(categoriesName)
    })
    const arrayCat = [...setCat]
    for(let i =0; i< arrayCat.length; i+=2){
        const id = arrayCat[i]
        const name = arrayCat[i+1]
        categories.push({
            id: id,
            name: name
        })
    }
    return categories
}*/
// Récupération de catégories via API
 export async function getCategories() {
    try {
        //appel fetch pour récupérer les données 
        const response = await fetch("http://localhost:5678/api/categories")
        if(response.status === 200){
            const categories = await response.json()
            return categories
        }else{
            throw new Error("Unexpected Error"+response.status)
        }
    } catch (error) {
        console.error(error.message)
    }
}
// Afficher les filtres de categories 
async function displayFilter(params) {
    const categories = await getCategories()
    categories.forEach(category => {
        const li = document.createElement("li")
        li.textContent = category.name
        li.id = category.id
        ul.appendChild(li)
    });
}
displayFilter()
//Filtrage des travaux par catégories
async function eventFilter() {
    const categories = await getCategories()
    const works = await getWorks()
    const liCatAll = document.querySelectorAll("#portfolio li")
    liCatAll.forEach(liCat => {
        liCat.addEventListener("click", (event)=>{
            gallery.innerHTML = ""
            const liId = event.target.id
            if(liId === "All"){
                displayWorks()
            }else{
                const workFiltered = works.filter((work)=> liId == work.category.id)
                // créer les éléments pour afficher les travaux filtrés
                workFiltered.forEach(work=> {
                    const figure = document.createElement("figure")
                    figure.id = work.id
                    const img = document.createElement("img")
                    img.src = work.imageUrl
                    img.alt = work.title
                    const figcaption = document.createElement("figcaption")
                    figcaption.textContent = work.title
                    figure.appendChild(img)
                    figure.appendChild(figcaption)
                    gallery.appendChild(figure)
                });
            }
        })
    });
}
eventFilter()
//Lorque l'utilisateur est connécté
function connectingUsers(){
    const token = window.localStorage.getItem("token")
    if(token){
        document.querySelector(".edit").style.display = "flex"
        document.querySelector("nav li:nth-child(3)").textContent = "logout"
        document.querySelector(".modif").style.display = "flex"
        document.querySelector("nav li:nth-child(3)").addEventListener("click",()=>{
            window.localStorage.removeItem("token");
            window.location.href = "./login/login.html"
        })
    }
} 
connectingUsers()


