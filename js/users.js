function addUser() {
    checkAuthentication();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    // check if login and password are not empty
    if (login.trim() === '' || password.trim() === '') {
        alert('Please enter a login and a password');
        return;
    }
    // check if the user already exists
    const users = document.getElementById('usersTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let i = 0; i < users.length; i++) {
        if (users[i].getElementsByTagName('td')[0].textContent === login) {
            alert('User already exists');
            return;
        }
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "../serveur/userController.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("User added");

            fetchUsers(); 
            document.getElementById('login').value = '';
            document.getElementById('password').value = '';
            
        }
    };
    xhr.send(`action=add&login=${login}&password=${password}&role=${role}`);
}


function deleteUser(login) {
    checkAuthentication();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "../serveur/userController.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let confirmation = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");

            if (!confirmation) {
                return;
            }
            if (localStorage.getItem('username') === login) {
                localStorage.removeItem('authenticated');
                window.location.href = '../vue/login.html';
            }
            fetchUsers(); 
        }
    };
    xhr.send(`action=delete&login=${login}`);

}


function fetchUsers() {
    checkAuthentication();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "../serveur/userController.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const users = response.user;
            console.log(users);
            const tbody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; 
            users.forEach(user => {
                let row = tbody.insertRow();
                row.insertCell(0).textContent = user.login;
       //         row.insertCell(1).textContent = user.password
                row.insertCell(1).textContent = user.role;

                let actionCell = row.insertCell(2);
                actionCell.classList.add('action-cell'); 
                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = function () {
                    deleteUser(user.login);
                };
                actionCell.appendChild(deleteButton);

                let updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.className = 'update-button';
                console.log('update user', user);
                updateButton.onclick = function () {
                   
                    updateUser(user.login, user.role,user.password); 
                
                };
                actionCell.appendChild(updateButton);
            });
           
        }
    };
    xhr.send("action=fetch");
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    fetchUsers();
});

function updateUser(login, role,password) {
    window.location.href = `../vue/updateUser.html?login=${login}&role=${role}`;
    localStorage.setItem('passwordToUpdate', password);
    
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


profile_diptacher = function () {
    window.location.href = '../vue/profile.html';
}

function sendTo(){
    window.location.href = '../vue/facture.html';
}

window.onload = function () {
    checkAuthentication();
};

function checkAuthentication() {
    var isAuthenticated = localStorage.getItem('authenticated');
    let role = localStorage.getItem('role');
    if (isAuthenticated == 'false' ) {
        window.location.href = '../vue/login.html';
    }else if(role != 'admin'){
        window.location.href = '../vue/facture.html';
    }
}

