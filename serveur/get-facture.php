<?php
header('Content-Type: application/json');

$factureId = isset($_GET['id']) ? $_GET['id'] : '';


$xmlFilePath = '../db/db-facture-file.xml'; 

if (file_exists($xmlFilePath) && !empty($factureId)) {
    $xml = simplexml_load_file($xmlFilePath);
    $result = null;

    foreach ($xml->facture as $facture) {
        if ((string) $facture['id'] === $factureId) {
            $result = $facture;
            break;
        }
    }

    if ($result !== null) {
  
        $json = json_encode($result);
        $array = json_decode($json, true);
        echo json_encode($array);
    } else {
       
        echo json_encode(['error' => 'Facture not found']);
    }
} else {
    echo json_encode(['error' => 'Missing facture ID or file not found']);
}
?>
