var numArticles = 1;
    
function addArticle() {
    numArticles++;

    var articlesContainer = document.getElementById('articlesContainer');
    var newArticle = document.createElement('div');
    newArticle.className = 'article';
    newArticle.innerHTML = `
        <label for="article${numArticles}Description">Article ${numArticles} Description:</label>
        <input type="text" name="article${numArticles}Description" required>

        <label for="article${numArticles}Quantity">Article ${numArticles} Quantity:</label>
        <input type="number" name="article${numArticles}Quantity" required>

        <label for="article${numArticles}Price">Article ${numArticles} Price:</label>
        
        <input type="number" name="article${numArticles}Price" step="0.01" required>
    `;

    articlesContainer.appendChild(newArticle);
}
function sendTo(){
    window.location.href = '../vue/facture.html';
}

var numTaxes = 1;

function addTax() {
    numTaxes++;
    var taxesContainer = document.getElementById('taxesContainer');
    var newTax = document.createElement('div');
    newTax.className = 'tax';
    newTax.innerHTML = `
        <label for="tax${numTaxes}Description">Tax ${numTaxes} Description:</label>
        <input type="text" name="tax${numTaxes}Description" required>

        <label for="tax${numTaxes}Montant">Tax ${numTaxes} Montant:</label>
        <input type="number" name="tax${numTaxes}Montant" step="0.01" required>
    `;

    taxesContainer.appendChild(newTax);
}


document.getElementById('factureForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var newFacture = {
        id: generateFactureId(),
        date: document.getElementById('date').value,
        fournisseur: {
            nom: document.getElementById('fournisseurNom').value,
            adresse: {
                rue: document.getElementById('fournisseurRue').value,
                ville: document.getElementById('fournisseurVille').value,
                codePostal: document.getElementById('fournisseurCodePostal').value,
                pays: document.getElementById('fournisseurPays').value
            }
        },
        client: {
            nom: document.getElementById('clientNom').value,
            adresse: {
                rue: document.getElementById('clientRue').value,
                ville: document.getElementById('clientVille').value,
                codePostal: document.getElementById('clientCodePostal').value,
                pays: document.getElementById('clientPays').value
            }
        },
        articles: [],
        taxes: [],
        total: 0
    };

    var articleContainers = document.getElementsByClassName('article');
    for (var i = 0; i < articleContainers.length; i++) {
        var articleContainer = articleContainers[i];
        var description = articleContainer.querySelector(`input[name="article${i + 1}Description"]`).value;
        var quantity = parseInt(articleContainer.querySelector(`input[name="article${i + 1}Quantity"]`).value, 10);
        var price = parseFloat(articleContainer.querySelector(`input[name="article${i + 1}Price"]`).value);

        if (description && !isNaN(quantity) && !isNaN(price)) {
            newFacture.articles.push({
                description: description,
                quantity: quantity,
                price: price
            });
        }
    }

    var total = newFacture.articles.reduce(function (acc, article) {
        return acc + article.quantity * article.price;
    }, 0);


    var taxContainers = document.getElementsByClassName('tax');
    for (var i = 0; i < taxContainers.length; i++) {
        var taxContainer = taxContainers[i];
        var taxDescription = taxContainer.querySelector(`input[name="tax${i + 1}Description"]`).value;
        var taxAmount = parseFloat(taxContainer.querySelector(`input[name="tax${i + 1}Montant"]`).value);

 
        if (taxDescription && !isNaN(taxAmount)) {
            newFacture.taxes.push({
                description: taxDescription,
                montant: taxAmount
            });
        }
    }
    newFacture.total = total;
    addFactureToXML(newFacture);
});

function generateFactureId() {
    return 'F' + Date.now();
}

function addFactureToXML(newFacture) {
    var xmlhttp = new XMLHttpRequest();
    let url = "../serveur/update-factures.php";
    console.log(url);
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                window.location.href = '../vue/facture.html';
            } else {
                console.error('Failed to add facture');
            }
        }
    };


    var jsonData = JSON.stringify(newFacture);

    xmlhttp.send(jsonData);
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


window.onload = function () {
    var isAuthenticated = localStorage.getItem('authenticated');
    if (isAuthenticated == 'false') {
        window.location.href = '../vue/login.html';
    }
};