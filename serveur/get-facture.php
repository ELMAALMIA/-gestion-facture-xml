<?php
header('Content-Type: application/json');

// Get the facture ID from the URL parameters
$factureId = isset($_GET['id']) ? $_GET['id'] : '';

// File path to the XML file
$xmlFilePath = '../db/db-facture-file.xml'; // Adjust the path as necessary

if (file_exists($xmlFilePath) && !empty($factureId)) {
    $xml = simplexml_load_file($xmlFilePath);
    $result = null;

    // Search for the facture by ID
    foreach ($xml->facture as $facture) {
        if ((string) $facture['id'] === $factureId) {
            $result = $facture;
            break;
        }
    }

    if ($result !== null) {
        // Convert the SimpleXMLElement to an array to make it easier to encode as JSON
        $json = json_encode($result);
        $array = json_decode($json, true);

        // Return the facture data as JSON
        echo json_encode($array);
    } else {
        // Facture not found
        echo json_encode(['error' => 'Facture not found']);
    }
} else {
    // Handle errors, such as missing parameters or file not found
    echo json_encode(['error' => 'Missing facture ID or file not found']);
}
?>
