document.addEventListener("DOMContentLoaded", () => {
const registerForm = document.getElementById("form");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signUp()
});
function signUp(){
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const cpassword=document.getElementById("cpassword").value
    console.log(email,password,cpassword);
    if(password !== cpassword){
        document.getElementById("error").innerHTML="password not matched"
        
    }
    else{
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch((error) => {
        console.log(error.message);
        document.getElementById("error").innerHTML = error.message
    });
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            location.replace(testTemplateURL);
        }
    });
}
}});