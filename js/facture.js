window.onload = function () {
    var isAuthenticated = localStorage.getItem('authenticated');
    if (isAuthenticated == 'false') {
        window.location.href = '../vue/login.html';
    }
    displayAdminButton();
};

function displayAdminButton() {
    const userRole = localStorage.getItem('role');
    if(userRole === 'admin') {
        const manageUsersButton = document.createElement('button');
        manageUsersButton.innerText = 'Manage Users';
        manageUsersButton.setAttribute('class', 'adminButton');
        manageUsersButton.onclick = function() {
            window.location.href = '../vue/usersManagement.html';
        };
        document.getElementById('adminActions').appendChild(manageUsersButton);
    }
}
function searchInputKeyup() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    performSearch(searchInput);
}
function performSearch(searchInput) {
    var filteredFactures = facturesData.filter(function(facture) {
        return facture.id.toLowerCase().includes(searchInput);
    });

    if (filteredFactures.length > 0 || searchInput === '') {
        currentPage = 1;
        facturesData = filteredFactures;
        displayFactures();
        displayPagination();
    } else {
        alert('No matching factures found.');
    }
}

function searchFacture() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    performSearch(searchInput);
}
function performSearch(searchInput) {
    var filteredFactures = facturesData.filter(function(facture) {
        return facture.id.toLowerCase().includes(searchInput);
    });

    if (filteredFactures.length > 0 || searchInput === '') {
        currentPage = 1; 
        facturesData = filteredFactures;
        displayFactures();
        displayPagination();
    } else {
        alert('No matching factures found.');
    }
}

    var currentPage = 1;
    var facturesPerPage = 5;
    var facturesData = [];

    
    function loadFactures() {
 
        facturesData = [];
        var url = "../db/db-facture-file.xml".toString();
        console.log(url);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "../db/db-facture-file.xml", false);
        xmlhttp.send();
        var xmlDoc = xmlhttp.responseXML;

        var factureElements = xmlDoc.getElementsByTagName('facture');

        for (var i = 0; i < factureElements.length; i++) {
            var facture = {
                id: factureElements[i].getAttribute('id'),
                date: factureElements[i].getElementsByTagName('date')[0].textContent,
                fournisseur: factureElements[i].getElementsByTagName('fournisseur')[0].getElementsByTagName('nom')[0].textContent,
                client: factureElements[i].getElementsByTagName('client')[0].getElementsByTagName('nom')[0].textContent,
                articles: getArticlesText(factureElements[i]),
                taxes: getTaxText(factureElements[i]),
                total: factureElements[i].getElementsByTagName('total')[0].textContent
            };

            facturesData.push(facture);
        }

  
        displayFactures();
        displayPagination();
    }
// sendTo home page
function sendTo(){
    window.location.href = '../vue/facture.html';
}

 
    function getArticlesText(factureElement) {
        var articles = factureElement.getElementsByTagName('articles')[0].getElementsByTagName('article');
        var articlesText = [];
        for (var i = 0; i < articles.length; i++) {
            var description = articles[i].getElementsByTagName('description')[0].textContent;
            var quantite = articles[i].getElementsByTagName('quantite')[0].textContent;
            var prixUnitaire = articles[i].getElementsByTagName('prixUnitaire')[0].textContent;
            var articleText = description + ' (Qty: ' + quantite + ', Price: ' + prixUnitaire + ')';
            articlesText.push(articleText);
        }
        return articlesText.join(', ');
    }


    function getTaxText(factureElement) {
        //

        var taxes = factureElement.getElementsByTagName('taxes')[0].getElementsByTagName('taxe');
        var taxesText = [];
        for (var i = 0; i < taxes.length; i++) {
            var description = taxes[i].getElementsByTagName('description')[0].textContent;
            var montant = taxes[i].getElementsByTagName('montant')[0].textContent;
            var taxText = description + ' (Amount: ' + montant + ')';
            taxesText.push(taxText);
        }
        return taxesText.join(', ');
    }

    function displayFactures() {
    var startIdx = (currentPage - 1) * facturesPerPage;
    var endIdx = startIdx + facturesPerPage;
    var facturesToShow = facturesData.slice(startIdx, endIdx);

    var facturesBody = document.getElementById('facturesBody');
    facturesBody.innerHTML = ''; 

    for (var i = 0; i < facturesToShow.length; i++) {
        var facture = facturesToShow[i];
        var row = facturesBody.insertRow();
        var cellId = row.insertCell(0);
        var cellDate = row.insertCell(1);
        var cellFournisseur = row.insertCell(2);
        var cellClient = row.insertCell(3);
        var cellArticles = row.insertCell(4);
        var cellTaxes = row.insertCell(5);
        var cellTotal = row.insertCell(6);
        var cellActions = row.insertCell(7); 

        cellId.innerHTML = facture.id;
        cellDate.innerHTML = facture.date;
        cellFournisseur.innerHTML = facture.fournisseur;
        cellClient.innerHTML = facture.client;
        cellArticles.innerHTML = facture.articles;
        cellTaxes.innerHTML = facture.taxes;
        cellTotal.innerHTML = facture.total;

 
        var updateButton = (function (factureId) {
            var btn = document.createElement('button');
            btn.innerHTML = 'Update';
            btn.id = factureId;
            btn.className = 'update-button';
            btn.addEventListener('click', function () {
              updateFacture(factureId);
            });
            return btn;
        })(facture.id);

        var deleteButton = (function (factureId) {
            var btn = document.createElement('button');
            btn.innerHTML = 'Delete';
            btn.id = factureId;
            btn.className = 'delete-button';
            btn.addEventListener('click', function () {
               deleteFacture(factureId);
            });
            return btn;
        })(facture.id);

  
        var pdfButton = (function (factureId) {
            var btn = document.createElement('button');
            btn.innerHTML = 'PDF';
            btn.id = factureId;
            btn.className = 'pdf-button';
            btn.addEventListener('click', function () {
                alert('PDF button clicked for ID: ' + factureId);
       
                generatePDF2(factureId);
              
            });
            return btn;
        })(facture.id);

        cellActions.appendChild(pdfButton);

  
        cellActions.appendChild(updateButton);
        cellActions.appendChild(deleteButton);
    }
}
/*
function  generatePDF(factureId){
    // use xsl 
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "facture.xsl", false);
    xmlhttp.send();
    var xslDoc = xmlhttp.responseXML;
    // generate pdf

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "db-facture-file.xml", false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);
    var resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
    var serializer = new XMLSerializer();
    var resultString = serializer.serializeToString(resultDocument);
    var doc = new jsPDF();
    doc.text(20, 20, resultString);
    doc.save('facture.pdf');
}
*/
function generatePDF() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "../xsl/facture.xsl", false);
    xmlhttp.send();
    var xslDoc = xmlhttp.responseXML;

  
    var transformedString = transformXMLToString(xslDoc, "../db/db-facture-file.xml");


    var printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.open();
    printWindow.document.write(transformedString);
    printWindow.document.close();


    printWindow.print();
    printWindow.close();
}

function transformXMLToString(xslDoc, xmlFilePath) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", xmlFilePath, false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);
    var resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
    var serializer = new XMLSerializer();
    var resultString = serializer.serializeToString(resultDocument);

    return resultString;
}

function generatePDF2(factureId) {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "../xsl/facture-id.xsl", false);
    xmlhttp.send();
    var xslDoc = xmlhttp.responseXML;


    var transformedString = transformXMLToString2(xslDoc, "../db/db-facture-file.xml", factureId);

  
    var printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.open();
    printWindow.document.write(transformedString);
    printWindow.document.close();


    printWindow.print();
    printWindow.close();
}

function transformXMLToString2(xslDoc, xmlFilePath, factureId) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", xmlFilePath, false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);

  
    xsltProcessor.setParameter(null, 'factureId', factureId);

    var resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
    var serializer = new XMLSerializer();
    var resultString = serializer.serializeToString(resultDocument);

    return resultString;
}

function removeFactureRow(factureId) {
    var facturesBody = document.getElementById('facturesBody');
    var rows = facturesBody.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].innerHTML === factureId) {
            facturesBody.removeChild(rows[i]);
            break; 
        }
    }
}

function deleteFacture(factureId) {
    var confirmation = window.confirm("Are you sure you want to delete this facture?");
    if (confirmation) {
  
        var xmlhttp = new XMLHttpRequest();
        var url = "../serveur/delete-facture.php";
        console.log(url);
        xmlhttp.open("POST",url , true); 
        xmlhttp.setRequestHeader('Content-Type', 'application/json');

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    removeFactureRow(factureId);

                    
                } else {
                    console.error('Failed to delete facture');
                }
            }
        };


        var jsonData = JSON.stringify({ factureId: factureId });
        xmlhttp.send(jsonData);
    }
}


    function updateFacture(id) {

        window.location.href = 'updateFacture.html?id=' + id;
    }

    function displayPagination() {
        var totalPages = Math.ceil(facturesData.length / facturesPerPage);

        var pagination = document.getElementById('pagination');
        pagination.innerHTML = ''; 

        for (var i = 1; i <= totalPages; i++) {
            var pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.innerHTML = i;
            pageLink.className = (i === currentPage) ? 'page-link active' : 'page-link';
            pageLink.addEventListener('click', function () {
                currentPage = parseInt(this.innerHTML);
                displayFactures();
                displayPagination();
            });
            pagination.appendChild(pageLink);
        }
    }

   
    loadFactures();
 


    function deconnection() {
        var confirmation = window.confirm("Voulez-vous vraiment vous déconnecter ?");
        if (confirmation) {
            localStorage.setItem('authenticated', 'false');
            localStorage.setItem('username', '');
            localStorage.setItem('role', '');
            window.location.href = '../vue/login.html';
        }
       
    }
    

    function addFacture() {
        window.location.href = '../vue/addFacture.html';
    }