<?php

$data = json_decode(file_get_contents("php://input"), true);


$factureId = $data['factureId'];


$xmlFilePath ="../db/db-facture-file.xml";


$xmlData = file_get_contents($xmlFilePath);

$xml = new SimpleXMLElement($xmlData);


$factureToDelete = null;
foreach ($xml->facture as $facture) {
    if ($facture['id'] == $factureId) {
        $factureToDelete = dom_import_simplexml($facture);
        break;
    }
}

if ($factureToDelete !== null) {
  
    $factureToDelete->parentNode->removeChild($factureToDelete);

    $xml->asXML($xmlFilePath);

    http_response_code(200);
    echo json_encode(['message' => 'Facture deleted successfully']);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Facture not found']);
}
?>
