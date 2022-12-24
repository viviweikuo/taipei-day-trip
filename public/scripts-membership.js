// sign-in
function memberSignin(){
    let errorMessage = document.querySelector(".login-error-message");

    let userEmail = document.querySelector(".login-email-input").value;
    let userPassword = document.querySelector(".login-password-input").value;
    let userData = {
        "email": userEmail,
        "password": userPassword
        };

    fetch("http://18.213.194.28:3000/api/user/auth", {
        method: "PUT",
        body: JSON.stringify(userData),
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json",
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {

            if (result["ok"]){
                location.reload();
            } else {
                errorMessage.innerHTML = result["message"];
                errorMessage.classList.remove("hide-content");
                errorMessage.classList.add("open-content");
                errorMessage.classList.add("error-message");

                let signinPopForm = document.querySelector(".login-popup");
                signinPopForm.style.height = "300px";
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

// sign-up
function memberSignup(){
    let errorMessage = document.querySelector(".signup-error-message")

    let userName = document.querySelector(".signup-name-input").value;
    let userEmail = document.querySelector(".signup-email-input").value;
    let userPassword = document.querySelector(".signup-password-input").value;
    let userData = {
        "name": userName,
        "email": userEmail,
        "password": userPassword
        };

    fetch("http://18.213.194.28:3000/api/user", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            "content-type": "application/json",
            "Accept": "application/json",
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {

            if (result["ok"]){
                errorMessage.innerHTML = "註冊完成";
                errorMessage.classList.remove("hide-content");
                errorMessage.classList.add("open-content");
                errorMessage.classList.add("error-message");

                let signupPopForm = document.querySelector(".signup-popup");
                signupPopForm.style.height = "345px";

            } else {
                errorMessage.innerHTML = result["message"];
                errorMessage.classList.remove("hide-content");
                errorMessage.classList.add("open-content");
                errorMessage.classList.add("error-message");

                let signupPopForm = document.querySelector(".signup-popup");
                signupPopForm.style.height = "345px";

            }
        })
        .catch((error) => {
            console.log(error)
        })
}

// check login status
function checkLogin(){

    fetch("http://18.213.194.28:3000/api/user/auth", {
        method: "GET",
        credentials: "include",
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {

            if (result.data != null){
                let signinButton = document.querySelector(".signin-signup-btn");
                signinButton.classList.add("hide-content");
                let logoutButton = document.querySelector(".logout-btn");
                logoutButton.style.display = "block";
                logoutButton.classList.remove("hide-content");
                logoutButton.classList.add("open-content");

                // booking page
                let userName = result.data["name"];
                let userNameBox = document.querySelector(".user-name");
                userNameBox.innerHTML = userName;
                let nameInputTarget = document.querySelector(".contact-information-name-input");
                nameInputTarget.value = result.data["name"];
                let emailInputTarget = document.querySelector(".contact-information-email-input");
                emailInputTarget.value = result.data["email"];
            }
        })
        .catch((error) => {
            console.log(error)
        })
}
checkLogin();

// log-out
function logout(){

    fetch("http://18.213.194.28:3000/api/user/auth", {
        method: "DELETE",
        credentials: "include",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json",
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {

            if (result["ok"]){
                location.reload();
                let signinButton = document.querySelector(".signin-signup-btn");
                signinButton.classList.remove("hide-content");
                let logoutButton = document.querySelector(".logout-btn");
                logoutButton.classList.remove("open-content");
                logoutButton.classList.add("hide-content");
            }
        })
        .catch((error) => {
            console.log(error)
        })
}

// close-form
function toggleForm(){
    let membershipForm = document.querySelector(".membership-container"); 
    membershipForm.classList.add("hide-content");
    let backgroundGray = document.querySelector(".background-layer");
    backgroundGray.classList.add("hide-content");

    // click signin/signup btn
    let loginButton = document.querySelector(".signin-signup-btn");

    loginButton.addEventListener("click", () => {
        membershipForm.classList.remove("hide-content");
        membershipForm.classList.add("open-content");

        backgroundGray.classList.remove("hide-content");
        backgroundGray.classList.add("open-content");
    })

    // click close btn
    let closeButton = document.querySelector(".close-btn");

    closeButton.addEventListener("click", () => {
        membershipForm.classList.remove("open-content");
        membershipForm.classList.add("hide-content");

        backgroundGray.classList.remove("open-content");
        backgroundGray.classList.add("hide-content");
    }, true);
}
toggleForm();

// change-form
function changeForm(){
    let signinForm = document.querySelector(".login-popup");
    signinForm.classList.add("open-content");
    let signupForm = document.querySelector(".signup-popup");
    signupForm.classList.add("hide-content");

    // change form signin => signup
    let changeToSignup = document.querySelector(".change-signin-to-signup");

    changeToSignup.addEventListener("click", () => {
        signupForm.classList.add("open-content");
        signupForm.classList.remove("hide-content");
        signinForm.classList.add("hide-content");
        signinForm.classList.remove("open-content");
    });

    // change form signup => signin
    let changeToSignin = document.querySelector(".change-signup-to-signin");

    changeToSignin.addEventListener("click", () => {
        signinForm.classList.remove("hide-content");
        signinForm.classList.add("open-content");
        signupForm.classList.remove("open-content");
        signupForm.classList.add("hide-content");
    });

    styleForm();
}
changeForm();

function styleForm(){
    let loginErrorMessage = document.querySelector(".login-error-message");
    loginErrorMessage.classList.remove("open-content");
    loginErrorMessage.classList.add("hide-content");
    let signinPopForm = document.querySelector(".login-popup");
    signinPopForm.style.height = "275px";

    let signupErrorMessage = document.querySelector(".signup-error-message");
    signupErrorMessage.classList.remove("open-content");
    signupErrorMessage.classList.add("hide-content");
    let signupPopForm = document.querySelector(".signup-popup");
    signupPopForm.style.height = "330px";
}