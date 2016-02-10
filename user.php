<?php 
	
   $user=json_decode(file_get_contents('php://input'));  //get user from json and check if matches the pass
	if($user->mail=='admin' && $user->pass=='1234') 
	session_start();
     $_SESSION['uid']=uniqid('ang_');
     print  $_SESSION['uid'];
	
?>