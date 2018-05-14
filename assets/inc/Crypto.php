<?php

class Crypto {

  public function __construct($config) {
    $this->algorithm = $config["algorithm"];
    $this->key = $config["key"];
    $this->iv = $config["iv"];
    $this->prefix = $config["prefix"];
  }

  function getIV() {
    return $this->iv;
  }

  function encrypt($text) {
    $ciphertext = openssl_encrypt($text, $this->algorithm, $this->key, OPENSSL_RAW_DATA, $this->getIV());
    return $this->prefix.bin2hex($ciphertext);
  }
  function decrypt($text) {
    return $this->prefix.hex2bin(openssl_decyrpt($text, $this->algorithm, $this->key, OPENSSL_RAW_DATA, $this->getIV()));
  }
}

?>
