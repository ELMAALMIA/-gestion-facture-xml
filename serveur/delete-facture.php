<?php
// Read the input data from the request
$data = json_decode(file_get_contents("php://input"), true);

// Facture ID to be deleted
$factureId = $data['factureId'];

// Your XML file path
$xmlFilePath ="../db/db-facture-file.xml";

// Read existing XML file
$xmlData = file_get_contents($xmlFilePath);

// Load XML data
$xml = new SimpleXMLElement($xmlData);

// Find and remove the facture with the specified ID
$factureToDelete = null;
foreach ($xml->facture as $facture) {
    if ($facture['id'] == $factureId) {
        $factureToDelete = dom_import_simplexml($facture);
        break;
    }
}

if ($factureToDelete !== null) {
    // Remove the facture from the XML
    $factureToDelete->parentNode->removeChild($factureToDelete);

    // Save the updated XML data
    $xml->asXML($xmlFilePath);

    // Send a success response
    http_response_code(200);
    echo json_encode(['message' => 'Facture deleted successfully']);
} else {
    // Send a failure response
    http_response_code(404);
    echo json_encode(['message' => 'Facture not found']);
}
?>
