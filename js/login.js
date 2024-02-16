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

            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('role', userElements[i].getElementsByTagName('role')[0].textContent); 
            window.location.href = '../vue/facture.html';
            return false;
        }
    }

    document.getElementById("usernameError").innerHTML = "* Nom d'utilisateur ou mot de passe incorrect";
    return false;
}


window.onload = function () {
    var isAuthenticated = localStorage.getItem('authenticated');
    if (isAuthenticated === 'true') {
     
        window.location.href = '../vue/facture.html';
    }
};