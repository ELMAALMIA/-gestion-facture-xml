function validateForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    document.getElementById("usernameError").innerHTML = "";
    document.getElementById("passwordError").innerHTML = "";

 
    var xmlhttp = new XMLHttpRequest();


var url = "../db/db-users-file.xml".toString();
console.log(url);
    xmlhttp.open("GET", "../db/db-users-file.xml", false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;


    var userElements = xmlDoc.getElementsByTagName('user');


    for (var i = 0; i < userElements.length; i++) {
        var xmlUsername = userElements[i].getElementsByTagName('login')[0].textContent;
        var xmlPassword = userElements[i].getElementsByTagName('password')[0].textContent;

        if (username === xmlUsername && password === xmlPassword) {
            // Store authentication status in local storage
            localStorage.setItem('authenticated', 'true');

            // Redirect to facture page
            window.location.href = '../vue/facture.html';
            return false;
        }
    }

    // Display error message if credentials are invalid
    document.getElementById("usernameError").innerHTML = "* Nom d'utilisateur ou mot de passe incorrect";
    return false;
}

// Check for authentication status on page load
window.onload = function () {
    var isAuthenticated = localStorage.getItem('authenticated');
    if (isAuthenticated === 'true') {
     
        window.location.href = '../vue/facture.html';
    }
};