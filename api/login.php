<?php
	//this would be much more complex in the actual backend, this works for now however
	if ($_POST["email"] == "placeholder@test.com" and $_POST["pass"] == "placeholder") {
		//this shouls start the session for the client webbrowser
		session_start();
	}
	else {
		header("HTTP/1.1 401 Unauthorized");	
		exit;
	}
?>
