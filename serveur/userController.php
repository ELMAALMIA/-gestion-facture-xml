<?php

include 'XMLUserManager.php';

$action = $_POST['action'] ?? '';
$xmlManager = new XMLUserManager('../db/db-users-file.xml', '../db/users.xsd');

switch ($action) {
    case 'add':
        $login = $_POST['login'] ?? '';
        $password = $_POST['password'] ?? ''; 
        $role = $_POST['role'] ?? '';
        $xmlManager->addUser($login, $password, $role);
        break;
    case 'fetch':
        echo $xmlManager->getUsersAsJson();
        break;
    case 'delete':
        $login = $_POST['login'] ?? '';
        $xmlManager->deleteUser($login);
        break;
        case 'update':
        $login = $_POST['login'] ?? '';
        $password = $_POST['password'] ?? '';
        $role = $_POST['role'] ?? '';
        $xmlManager->updateUser($login, $password, $role);
        break;
    default:
        http_response_code(400);
        echo json_encode(['message' => 'Invalid action']);
        break;
        
}

?>
