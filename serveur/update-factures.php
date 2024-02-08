<?php
// Get the new facture data from the POST request
$newFacture = json_decode(file_get_contents("php://input"), true);

// Read existing XML file


$xmlFilePath ="../db/db-facture-file.xml";

$xmlData = file_get_contents($xmlFilePath);

// Load XML data
$xml = new SimpleXMLElement($xmlData);

// Create a new facture element
$facture = $xml->addChild('facture');
$facture->addAttribute('id', $newFacture['id']);

// Add date element
$date = $facture->addChild('date', $newFacture['date']);

// Add fournisseur element
$fournisseur = $facture->addChild('fournisseur');
$fournisseur->addChild('nom', $newFacture['fournisseur']['nom']);
$fournisseurAdresse = $fournisseur->addChild('adresse');
$fournisseurAdresse->addChild('rue', $newFacture['fournisseur']['adresse']['rue']);
$fournisseurAdresse->addChild('ville', $newFacture['fournisseur']['adresse']['ville']);
$fournisseurAdresse->addChild('codePostal', $newFacture['fournisseur']['adresse']['codePostal']);
$fournisseurAdresse->addChild('pays', $newFacture['fournisseur']['adresse']['pays']);

// Add client element
$client = $facture->addChild('client');
$client->addChild('nom', $newFacture['client']['nom']);
$clientAdresse = $client->addChild('adresse');
$clientAdresse->addChild('rue', $newFacture['client']['adresse']['rue']);
$clientAdresse->addChild('ville', $newFacture['client']['adresse']['ville']);
$clientAdresse->addChild('codePostal', $newFacture['client']['adresse']['codePostal']);
$clientAdresse->addChild('pays', $newFacture['client']['adresse']['pays']);

// Add articles elements
$articles = $facture->addChild('articles');
foreach ($newFacture['articles'] as $article) {
    $articleElement = $articles->addChild('article');
    $articleElement->addChild('description', $article['description']);
    $articleElement->addChild('quantite', $article['quantity']);
    $articleElement->addChild('prixUnitaire', $article['price']);
}

// Add taxes elements
$taxes = $facture->addChild('taxes');
foreach ($newFacture['taxes'] as $tax) {
    $taxElement = $taxes->addChild('taxe');
    $taxElement->addChild('description', $tax['description']);
    $taxElement->addChild('montant', $tax['montant']);
}

// Add total element
$facture->addChild('total', $newFacture['total']);

// Save the updated XML data
$xml->asXML($xmlFilePath);

// Send a response
http_response_code(200);
?>
