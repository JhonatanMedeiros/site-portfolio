<?php
// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments Provided!";
	return false;
   }
	
$name = strip_tags(htmlspecialchars($_POST['name']));
$email_address = strip_tags(htmlspecialchars($_POST['email']));
$message = strip_tags(htmlspecialchars($_POST['message']));
	
// Create the email and send the message
$to = 'contato@jhonatanmedeiros.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
$email_subject = "Website Contact Form:  $name";
$email_body = "
<html>
<head>
<title>HTML email</title>
</head>
<body>
<h3>Você recebeu uma mensagem de seu formulario de contato.</h3>
<h4>Aqui estão os detalhes:</h4>
<span>Nome: $name</span><br><br>
<span>Email: $email_address</span><br><br>
<span>Mensagem: $message</span>
</body>
</html>
";
//$headers = "From: contato@jhonatanmedeiros.com\n";
//$headers .= "Reply-To: $email_address\n";
//$headers .= "MIME-Version: 1.0\n";
//$headers .= "Content-type: text/html; charset=UTF-8";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= 'From: <contato@jhonatanmedeiros.com>' . "\r\n";
$headers .= 'Cc: jhonatan.medeiros02@gmail.com' . "\r\n";

mail($to,$email_subject,$email_body,$headers);
return true;			
?>