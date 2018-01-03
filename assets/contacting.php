<?php
/* simple php mail() sender */
function sendMail($config, $data, $headers = array()) {
  $message = easyStringTemplate($config["message"], $data);

  $headers[] = 'MIME-Version: 1.0';
  $headers[] = 'Content-type: text/html; charset=utf-8';

  // Additional headers
  $headers[] = "To: $data[to]";
  $headers[] = "From: $data[email]";
  $headers[] = "Reply-To: $data[email]";
  $headers[] = 'X-Mailer: PHP/' . phpversion();

  return mail($data["to"], $data["subject"], $message, implode("\r\n", $headers));
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


function easyStringTemplate($template, $variables) {

  extract($variables);
  $session = @session_id(); // TODO: start session?
  if (!$session)$session = uniqid('', true);

  if (preg_match_all("/\\$(\w+)(\([^\)]+\))?/", $template, $matches)) {
    foreach ($matches[1] as $i => $varname) {

      if ($varname==="date")$date=date(preg_replace("/[\\(\\)]/", "", $matches[2][$i]));

      $template = str_replace($matches[0][$i], sprintf('%s', @$$varname), $template);

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
    $Message = $client->send(easyStringTemplate($config["message"], $data));

    return true;
  } catch(RuntimeException $e) {
    // print_r($e);
    return false;
  }

}


/* write CSV log to server */
function writeCsv($config, $data) {
  $filename = easyStringTemplate($config["filename"], $data);

  if (is_writable($filename)) {
      if (!$handle = fopen($filename, 'a')) {
        // echo "<h2>Cannot open file ($filename)</h2>";
        return false;
      }

      if (fwrite($handle, easyStringTemplate($config["message"], $data) . "\r\n") === FALSE) {
        // echo "<h2>Cannot write to file ($filename)</h2>";
        return false;
      }

      fclose($handle);

  } else {
    // echo "<h2>The file $filename is not writable</h2>";
    return false;
  }
  return true;
}



/* Message "factory" */
function sendMessage($data, $configuration) {

  $return = true;
  // shall send email always?
  /* control logic */
  if (
    /*!$_REQUEST["name"] || -- name should not be required */
    !$_REQUEST["message"] ||
    $_REQUEST["_honeypot"] || $_REQUEST["_honey"] || $_REQUEST["phone"] || $_REQUEST["username"] || $_REQUEST["subject"] || $_REQUEST["country"] || $_REQUEST["city"] || $_REQUEST["address"]
  ) {
    // it must be a robot, if the hidden variable is being filled, which were used obfuscating
    // echo "<h2>Found hidden variable!</h2>";
    $return = false;
  } else {
    if (preg_match("/slack/i", $configuration["messaging"])) $return = $return && sendSlackMessage($configuration['slack.config'], $configuration['slack.settings'], $data);
    if (preg_match("/email/i", $configuration["messaging"])) $return = $return && sendMail($configuration['email.config'], $data);
  }
  if (preg_match("/csv/i", $configuration["messaging"])) $return = $return && writeCsv($configuration['csv.config'], $data);
  return $return;
}





/*config */
$configFile="inc/_config.ini";

if (!defined('INI_SCANNER_TYPED')) {
  // PHP 5.x
  $configuration = typeSafeIniArrayConverter(parse_ini_file($configFile, true));
} else {
  // PHP >= 5.6.1
  $configuration = parse_ini_file($configFile, true, INI_SCANNER_TYPED);
}

/* send mail via php mail() and smtp */
if (sendMessage(
  array(
    "to" => $_REQUEST["_to"] ? $_REQUEST["_to"] : 'admin@finnoconsult.at',
    "subject" => $_REQUEST["_subject"] ? $_REQUEST["_subject"] : 'Contact form submission',
    "email" => $_REQUEST["email"] ? $_REQUEST["email"] : $_REQUEST["_replyto"],
    "name" => $_REQUEST["name"],
    "referer" => $_SERVER["HTTP_REFERER"],
    "message" => $_REQUEST["message"],
    // just for storing into CSV:
    "subject" => $_REQUEST["subject"],
    "phone" => $_REQUEST["phone"],
    "country" => $_REQUEST["country"],
    "city" => $_REQUEST["city"],
    "address" => $_REQUEST["address"],
    "_honeypot" => $_REQUEST["_honeypot"],
    "_honey" => $_REQUEST["_honey"],
    "_replyto" => $_REQUEST["_replyto"],
    "_after" => $_REQUEST["_after"],
  ),
  $configuration
)) {
  header("Location: " . (@$configuration["after"] ? @$configuration["after"] : $_REQUEST["_after"]));
} else {
  header("Location: 500");
}
?>
