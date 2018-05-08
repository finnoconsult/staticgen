<?php

class Crypto {

  public function __construct($config) {
    $this->algorithm = $config["algorithm"];
    $this->password = $config["password"];
    $this->iv = $config["iv"];
    $this->prefix = $config["prefix"];
  }

  function encrypt($text) {
    return $this->prefix.bin2hex(openssl_encrypt($text, $this->algorithm, $this->password, OPENSSL_RAW_DATA, $this->iv));
  }
}

?>
