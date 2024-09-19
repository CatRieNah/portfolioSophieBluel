document.querySelector("form").addEventListener("submit",async (event)=>{
    event.preventDefault() // évite le chargement de la page lors de soumission de formulaire
    await loginUsers()
})
async function loginUsers() {
    try {
        const email= document.getElementById("email").value
        const password = document.getElementById("password").value
        if(email !== "" && password !== ""){
        //envoi de la requête
            const response = await fetch("http://localhost:5678/api/users/login",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        if (response.status === 200){
            const data = await response.json()
            //récuperer et stocker la valeur de token sur localstorage
            const authToken = data.token 
            window.localStorage.setItem("token", authToken)
            //redirection vers la page d'acceuil
            window.location.href = "../index.html"
        }else{
            throw new Error("E-mail ou mot de passe incorrecte")
        }
    }else{
        throw new Error ("Entrez votre e-mail ou votre mot de passe")
    }
    } catch (error) {
        console.error(error.message)
        document.querySelector(".error_message").textContent = error.message
        document.getElementById("email").classList.add("error_input")
        document.getElementById("password").classList.add("error_input")
        email.value = ""
        password.value = ""

    }
}