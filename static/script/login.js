
document.addEventListener("DOMContentLoaded", () => {
    // Adding event listener to the form to prevent default submission
    document.getElementById("loginForm").addEventListener("submit", (event) => {
        event.preventDefault();
        login()
    });

    // Checking user authentication state
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            location.replace(testTemplateURL);
        }
    });

    // Function for logging in
    function login() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((error) => {
                // document.getElementById("error").innerHTML = error.message;
                alert(error.message)
            });
    }
   

   
});
function forgotPass(){
    const email = document.getElementById("email").value
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
        alert("Reset link sent to your email id")
    })
    .catch((error) => {
        // document.getElementById("error").innerHTML = error.message
        alert(error.message)
    });
}
