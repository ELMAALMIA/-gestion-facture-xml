document.addEventListener('DOMContentLoaded', function() {
    var factureId = new URLSearchParams(window.location.search).get('id');
    if (factureId) {
        loadFactureData(factureId);
    } else {
        console.error('Facture ID is required.');
    }

    document.getElementById('factureForm').addEventListener('submit', function(event) {
        event.preventDefault();
      
        submitUpdatedFacture(factureId);
    });
});

function loadFactureData(factureId) {
   
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var factureData = JSON.parse(this.responseText);
            populateForm(factureData);
        }
    };
    xmlhttp.open("GET", "../serveur/get-facture.php?id=" + factureId, true);
    xmlhttp.send();
   
}

function populateForm(data) {
    document.getElementById('date').value = data.date;
    document.getElementById('fournisseurNom').value = data.fournisseur.nom;
    document.getElementById('fournisseurRue').value = data.fournisseur.adresse.rue;
    document.getElementById('fournisseurVille').value = data.fournisseur.adresse.ville;
    document.getElementById('fournisseurCodePostal').value = data.fournisseur.adresse.codePostal;
    document.getElementById('fournisseurPays').value = data.fournisseur.adresse.pays;
    document.getElementById('clientNom').value = data.client.nom;
    document.getElementById('clientRue').value = data.client.adresse.rue;
    document.getElementById('clientVille').value = data.client.adresse.ville;
    document.getElementById('clientCodePostal').value = data.client.adresse.codePostal;
    document.getElementById('clientPays').value = data.client.adresse.pays;

 
    document.getElementById('articlesContainer').innerHTML = '';
    document.getElementById('taxesContainer').innerHTML = '';
   
  addArticle(data.articles);
  addTax(data.taxes);
  updateTotal();

  setupInputListeners(); 

}

function setupInputListeners() {
    document.querySelectorAll('.article input, .tax input').forEach(input => {
        input.addEventListener('input', updateTotal);
    });
}

function addTaxAction() {
    var taxesContainer = document.getElementById('taxesContainer');
    var currentTaxes = taxesContainer.getElementsByClassName('tax').length; 
    var tax = { description: '', montant: '' }; 
    addTax({ taxe: [tax] }, currentTaxes); 
    setupInputListeners();
}


function addArticleAction() {
    var articlesContainer = document.getElementById('articlesContainer');
    var currentArticles = articlesContainer.getElementsByClassName('article').length; 
    var article = { description: '', quantite: '', prixUnitaire: '' }; 
    addArticle({ article: [article] }, currentArticles); 
    setupInputListeners();
}

function updateTotal() {
    var articles = document.querySelectorAll('.article');
    var taxes = document.querySelectorAll('.tax');
    var total = 0;

    articles.forEach(article => {
        var quantite = parseFloat(article.querySelector('input[name$="[quantite]"]').value) || 0;
        var prixUnitaire = parseFloat(article.querySelector('input[name$="[prixUnitaire]"]').value) || 0;
        total += quantite * prixUnitaire;
    });

    taxes.forEach(tax => {
        var montant = parseFloat(tax.querySelector('input[name$="[montant]"]').value) || 0;
        total += montant;
    });

    var totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.value = total.toFixed(2); 
    } else {
        console.error('Element with ID "total" not found.');
    }
}




function sendTo(){
    window.location.href = '../vue/facture.html';
}

function submitUpdatedFacture(factureId) {
    var data = collectInvoiceData(); 
    var xmlhttp = new XMLHttpRequest();
    let url = "../serveur/update-facture.php";
    xmlhttp.open("POST", url, true);

    var self = this;

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                alert('Facture updated successfully.',true);
                window.location.href = '../vue/facture.html';
            } else {
                alert('Failed to update facture. Server responded with status code: ' + xmlhttp.status);
            }
        }
    };

    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
    
}
function collectInvoiceData() {
    var data = {
        factureId: new URLSearchParams(window.location.search).get('id'),
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

    document.querySelectorAll('.article').forEach((articleDiv, index) => {
        data.articles.push({
            description: articleDiv.querySelector('input[name$="[description]"]').value,
            quantite: articleDiv.querySelector('input[name$="[quantite]"]').value,
            prixUnitaire: articleDiv.querySelector('input[name$="[prixUnitaire]"]').value
        });
    });

    document.querySelectorAll('.tax').forEach((taxDiv, index) => {
        data.taxes.push({
            description: taxDiv.querySelector('input[name$="[description]"]').value,
            montant: taxDiv.querySelector('input[name$="[montant]"]').value
        });
    });

    data.total = document.getElementById('total').value; 

    return data;
}


function addTax(taxesData, startIndex = 0) {
    var taxesContainer = document.getElementById('taxesContainer');
    if (taxesData.taxe && Array.isArray(taxesData.taxe)) {
        taxesData.taxe.forEach((tax, index) => {
            var currentIndex = startIndex + index + 1; 
            var taxHtml = `
                <div class="tax">
                    <label for="tax${currentIndex}Description">Tax ${currentIndex} Description:</label>
                    <input type="text" name="taxes[${currentIndex - 1}][description]" value="${tax.description}" placeholder="Description" required>
                    <label for="tax${currentIndex}Montant">Tax ${currentIndex} Montant:</label>
                    <input type="number" name="taxes[${currentIndex - 1}][montant]" value="${tax.montant}" placeholder="Montant" required>
                </div>
            `;
            taxesContainer.insertAdjacentHTML('beforeend', taxHtml);
        });
    }
}

function addArticle(articlesData, startIndex = 0) {
    var articlesContainer = document.getElementById('articlesContainer');
    if (articlesData.article && Array.isArray(articlesData.article)) {
        articlesData.article.forEach((article, index) => {
            var currentIndex = startIndex + index + 1; 
            var articleHtml = `
                <div class="article">
                    <label for="article${currentIndex}Description">Article ${currentIndex} Description:</label>
                    <input type="text" name="articles[${currentIndex - 1}][description]" value="${article.description}" placeholder="Description" required>
                    <label for="article${currentIndex}Quantite">Article ${currentIndex} Quantité:</label>
                    <input type="number" name="articles[${currentIndex - 1}][quantite]" value="${article.quantite}" placeholder="Quantité" required>
                    <label for="article${currentIndex}PrixUnitaire">Article ${currentIndex} Prix unitaire:</label>
                    <input type="number" name="articles[${currentIndex - 1}][prixUnitaire]" value="${article.prixUnitaire}" placeholder="Prix unitaire" required>
                </div>
            `;
            articlesContainer.insertAdjacentHTML('beforeend', articleHtml);
        });
    }
}



function deconnection() {
    var confirmation = window.confirm("Voulez-vous vraiment vous déconnecter ?");
    if (confirmation) {
        localStorage.removeItem('authenticated');
        window.location.href = '../vue/login.html';
    }
}

window.onload = function () {
    var isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
        window.location.href = '../vue/login.html';
    }
};