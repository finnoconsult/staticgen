<?php
if ($_REQUEST["_honeypot"]) {
  header("Location: 500");
}
$to = $_REQUEST["_to"] ? $_REQUEST["_to"] : 'admin@finnoconsult.at';
$subject = $_REQUEST["_subject"] ? $_REQUEST["_subject"] : 'Contact form submission';
$email = $_REQUEST["email"] ? $_REQUEST["email"] : $_REQUEST["_replyto"];
$message = "
<html>
<head>
  <title>$subject</title>
</head>
<body>
  <h1>$subject</h1>
  <table>
    <tr>
      <th>Name</th><td>$_REQUEST[name]</td>
    </tr>
    <tr>
      <th>Email</th><td><a href=\"mailto:$email\">$email</a></td>
    </tr>
    <tr>
      <th>Message</th>
    </tr>
    <tr>
      <td>$_REQUEST[message]</td>
    </tr>
    <tr>
    <th>Referrer</th><td>$_SERVER[HTTP_REFERER]</td>
    </tr>
  </table>
</body>
</html>
";

$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=utf-8';

// Additional headers
$headers[] = "To: $to";
$headers[] = "From: $email";
$headers[] = "Reply-To: $email";
$headers[] = 'X-Mailer: PHP/' . phpversion();

if (mail($to, $subject, $message, implode("\r\n", $headers))) {
  header("Location: $_REQUEST[_after]");
} else {
  header("Location: 500");
}
?>
