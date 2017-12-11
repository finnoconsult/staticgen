<?php
/* simple php mail() sender */
function sendMail($config, $data, $headers = array()) {
  $message = messageTemplate($config["message"], $data);

  $headers[] = 'MIME-Version: 1.0';
  $headers[] = 'Content-type: text/html; charset=utf-8';

  // Additional headers
  $headers[] = "To: $data[to]";
  $headers[] = "From: $data[email]";
  $headers[] = "Reply-To: $data[email]";
  $headers[] = 'X-Mailer: PHP/' . phpversion();

  return mail($data[to], $data[subject], $message, implode("\r\n", $headers));
}




/* slack message sender */
function typeSafeIniArrayConverter($array) {
  foreach ($array as $k => $e) {
    if (is_array($e)) {
      $array[$k] = typeSafeIniArrayConverter($e);
    } elseif (in_array($k, array('allow_markdown', 'link_names'))) {
      $array[$k] = true && $e;
    }
  }
  return $array;
}


function messageTemplate($template, $variables) {

  extract($variables);
  $session = @session_id(); // TODO: start session?
  if (!$session)$session = uniqid('', true);

  if (preg_match_all("/\\$(\w+)(\([^\)]+\))?/", $template, $matches)) {
    foreach ($matches[1] as $i => $varname) {

      if ($varname==="date")$date=date(preg_replace("/[\\(\\)]/", "", $matches[2][$i]));

      $template = str_replace($matches[0][$i], sprintf('%s', $$varname), $template);

    }
  }
  return $template;

}


function sendSlackMessage($config, $settings, $data) {
  /* send message to dedicated slack channel */
  require_once "./api/vendor/guzzlehttp/guzzle/src/ClientInterface.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Handler/Proxy.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Handler/CurlHandler.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Handler/CurlFactoryInterface.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Handler/EasyHandle.php";
  require_once "./api/vendor/guzzlehttp/promises/src/PromiseInterface.php";
  require_once "./api/vendor/guzzlehttp/promises/src/Promise.php";
  require_once "./api/vendor/guzzlehttp/promises/src/FulfilledPromise.php";
  require_once "./api/vendor/guzzlehttp/promises/src/TaskQueueInterface.php";
  require_once "./api/vendor/guzzlehttp/promises/src/TaskQueue.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Handler/CurlFactory.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Handler/CurlMultiHandler.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Handler/StreamHandler.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/functions_include.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/PrepareBodyMiddleware.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Exception/GuzzleException.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Exception/TransferException.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Exception/RequestException.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Exception/BadResponseException.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Exception/ClientException.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Exception/RequestException.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Middleware.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/HandlerStack.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/RedirectMiddleware.php";
  require_once "./api/vendor/psr/http-message/src/UriInterface.php";
  require_once "./api/vendor/psr/http-message/src/MessageInterface.php";
  require_once "./api/vendor/psr/http-message/src/RequestInterface.php";
  require_once "./api/vendor/psr/http-message/src/ResponseInterface.php";
  require_once "./api/vendor/psr/http-message/src/StreamInterface.php";
  require_once "./api/vendor/guzzlehttp/psr7/src/MessageTrait.php";
  require_once "./api/vendor/guzzlehttp/psr7/src/Stream.php";
  require_once "./api/vendor/guzzlehttp/psr7/src/Request.php";
  require_once "./api/vendor/guzzlehttp/psr7/src/Response.php";
  require_once "./api/vendor/guzzlehttp/psr7/src/Uri.php";
  require_once "./api/vendor/guzzlehttp/psr7/src/functions_include.php";
  require_once "./api/vendor/guzzlehttp/promises/src/functions_include.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/Client.php";
  require_once "./api/vendor/guzzlehttp/guzzle/src/RequestOptions.php";
  require_once "./api/vendor/maknz/slack/src/Message.php";
  require_once "./api/vendor/maknz/slack/src/Client.php";

  // echo "sendSlackMessage(".serialize($config).", ".serialize($settings).", ".serialize($data).")";

  try {
    $client = new Maknz\Slack\Client($config['url'], $settings);
    $Message = $client->send(messageTemplate($config["message"], $data));

    return true;
  } catch(RuntimeException $e) {
    // print_r($e);
    return false;
  }

}




/* Message "factory" */
function sendMessage($data, $configFile="inc/_config.ini") {

  /*config */
  if (!defined('INI_SCANNER_TYPED')) {
    // PHP 5.x
    $configuration = typeSafeIniArrayConverter(parse_ini_file($configFile, true));
  } else {
    // PHP >= 5.6.1
    $configuration = parse_ini_file($configFile, true, INI_SCANNER_TYPED);
  }

  $return = true;
  // shall send email always?
  if (preg_match("/email/i", $configuration["messaging"])) $return = $return && sendMail($configuration['email.config'], $data);
  if (preg_match("/slack/i", $configuration["messaging"])) $return = $return && sendSlackMessage($configuration['slack.config'], $configuration['slack.settings'], $data);
  return $return;
}


/* control logic */
if ($_REQUEST["_honeypot"] || $_REQUEST["_honey"]) {
  // it must be a robot, if the hidden variable is being filled, which were used obfuscating
  header("Location: 500");
}



/* send mail via php mail() and smtp */
if (sendMessage(array(
  "to" => $_REQUEST["_to"] ? $_REQUEST["_to"] : 'admin@finnoconsult.at',
  "subject" => $_REQUEST["_subject"] ? $_REQUEST["_subject"] : 'Contact form submission',
  "email" => $_REQUEST["email"] ? $_REQUEST["email"] : $_REQUEST["_replyto"],
  "name" => $_REQUEST["name"],
  "message" => $_REQUEST["message"],
  "referer" => $_SERVER["HTTP_REFERER"],
))) {
  header("Location: $_REQUEST[_after]");
} else {
  header("Location: 500");
}
?>
