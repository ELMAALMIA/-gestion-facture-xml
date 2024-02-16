<?php

class XMLUserManager {
    private $xmlFilePath;
    private $xsdFilePath;

    public function __construct($xmlFilePath, $xsdFilePath) {
        $this->xmlFilePath = $xmlFilePath;
        $this->xsdFilePath = $xsdFilePath;
    }

    public function addUser($login, $password, $role) {
        $xml = new SimpleXMLElement($this->xmlFilePath, 0, true);

        $user = $xml->addChild('user');
        $user->addChild('login', $login);
        $user->addChild('password', $password);
        $user->addChild('role', $role);

        $xml->asXML($this->xmlFilePath);
    }

    public function getUsersAsJson() {
        $xml = simplexml_load_file($this->xmlFilePath);
        return json_encode($xml);
    }

    public function deleteUser($login) {
        $xml = simplexml_load_file($this->xmlFilePath);
        $xpath = "user[login='$login']";
        $node = $xml->xpath($xpath)[0];
        unset($node[0]);
        $xml->asXML($this->xmlFilePath);
    }

    public function updateUser($login, $password, $role) {
        $xml = simplexml_load_file($this->xmlFilePath);
        $xpath = "user[login='$login']";
        $node = $xml->xpath($xpath)[0];
        $node->password = $password;
        $node->role = $role;
        $xml->asXML($this->xmlFilePath);
    }

}

?>
