<?php

// Get the new facture data from the POST request
$newFacture = json_decode(file_get_contents("php://input"), true);

// Read existing XML file
$xmlFilePath = "../db/db-facture-file.xml";
$xmlData = file_get_contents($xmlFilePath);

// Load XML data
$xml = new SimpleXMLElement($xmlData);

// Find the specific facture by its ID
$foundFacture = null;
foreach ($xml->facture as $facture) {
    if ((string)$facture['id'] === $newFacture['factureId']) {
        $foundFacture = $facture;
        break;
    }
}

if ($foundFacture) {
    // Update the facture with new data
    $foundFacture->date = $newFacture['date'];
    
    // Update fournisseur information
    $foundFacture->fournisseur->nom = $newFacture['fournisseur']['nom'];
    $foundFacture->fournisseur->adresse->rue = $newFacture['fournisseur']['adresse']['rue'];
    $foundFacture->fournisseur->adresse->ville = $newFacture['fournisseur']['adresse']['ville'];
    $foundFacture->fournisseur->adresse->codePostal = $newFacture['fournisseur']['adresse']['codePostal'];
    $foundFacture->fournisseur->adresse->pays = $newFacture['fournisseur']['adresse']['pays'];

    // Update client information
    $foundFacture->client->nom = $newFacture['client']['nom'];
    $foundFacture->client->adresse->rue = $newFacture['client']['adresse']['rue'];
    $foundFacture->client->adresse->ville = $newFacture['client']['adresse']['ville'];
    $foundFacture->client->adresse->codePostal = $newFacture['client']['adresse']['codePostal'];
    $foundFacture->client->adresse->pays = $newFacture['client']['adresse']['pays'];

    // Update articles
    unset($foundFacture->articles->article);
    foreach ($newFacture['articles'] as $articleData) {
        $article = $foundFacture->articles->addChild('article');
        $article->addChild('description', $articleData['description']);
        $article->addChild('quantite', $articleData['quantite']);
        $article->addChild('prixUnitaire', $articleData['prixUnitaire']);
    }

    // Update taxes
    unset($foundFacture->taxes->taxe);
    if (isset($newFacture['taxes'])) {
        foreach ($newFacture['taxes'] as $taxData) {
            $tax = $foundFacture->taxes->addChild('taxe');
            $tax->addChild('description', $taxData['description']);
            $tax->addChild('montant', $taxData['montant']);
        }
    }

    // Update total
    unset($foundFacture->total);
    $foundFacture->addChild('total', $newFacture['total']);

    // Save the updated XML data
    $xml->asXML($xmlFilePath);

    // Send a success response
    http_response_code(200);
    echo json_encode(array("message" => "Facture updated successfully."));
} else {
    // Send a failure response if facture with given ID not found
    http_response_code(404);
    echo json_encode(array("error" => "Facture with given ID not found."));
}
?>
