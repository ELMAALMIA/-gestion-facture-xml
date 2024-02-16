window.onload = function() {
deconnectionCheck();
    const login = getQueryParam('login');
    const role = getQueryParam('role');
    if (login && role) {
        populateForm({ login, role });
    } else {
        console.error('Insufficient user data provided.');
    }
};
function deconnectionCheck() {
    var isAuthenticated = localStorage.getItem('authenticated');
    // not authenticated and not admin
    let role = localStorage.getItem('role');
    if (isAuthenticated == 'false' ) {
        window.location.href = '../vue/login.html';
    }else if(role != 'admin'){
        window.location.href = '../vue/facture.html';
    }
}
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


function populateForm(userData) {
    document.getElementById('login').value = userData.login;
    document.getElementById('role').value = userData.role;
}

document.getElementById('updateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateUser();
});

function fetchUserData(login, role, callback) {
    console.log(`Fetching data for login: ${login}`);
    setTimeout(() => {
        const userData = { login, role }; 
        callback(userData);
    }, 1000);
}

function updateUser() {
    let login = document.getElementById('login').value;

    let password = document.getElementById('password').value;
    if (!password) {
        password = localStorage.getItem('passwordToUpdate');
    }
    localStorage.setItem('passwordToUpdate', '');
    const role = document.getElementById('role').value;

    window.alert(`Updating user: ${login} with password: ${password} and role: ${role}`);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "../serveur/userController.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("User updated");
            window.location.href = '../vue/usersManagement.html';
        }
    }
    xhr.send(`action=update&login=${login}&password=${password}&role=${role}`);
    window.location.href = '../vue/usersManagement.html';
}

function sendTo(){
    window.location.href = '../vue/facture.html';
}


function deconnection() {
    var confirmation = window.confirm("Voulez-vous vraiment vous déconnecter ?");
    if (confirmation) {
        localStorage.setItem('authenticated', 'false');
        localStorage.setItem('username', '');
        localStorage.setItem('role', '');
        window.location.href = '../vue/login.html';
    }
}
