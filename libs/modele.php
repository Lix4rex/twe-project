<?php

/*
Dans ce fichier, on définit diverses fonctions permettant de récupérer des données utiles pour notre TP d'identification. Deux parties sont à compléter, en suivant les indications données dans le support de TP
*/


/********* EXERCICE 2 : prise en main de la base de données *********/

include_once "libs/maLibSQL.pdo.php";

// inclure ici la librairie faciliant les requêtes SQL (en veillant à interdire les inclusions multiples)


function getGroups($id_user){
	$id_user = proteger($id_user);
	$SQL = "select groups.* from groups join group_members on group_members.group_id=groups.id where group_members.user_id='$id_user'";
	return parcoursRs(SQLSelect($SQL));
}

function getGroup($id_group){
	$id_group = proteger($id_group);
	$SQL = "select * from groups where id='$id_group'";
	return parcoursRs(SQLSelect($SQL));
}

function getGroupUsers($id_group){
	$id_group = proteger($id_group);
	$SQL = "select * from group_members where group_id='$id_group'";
	return parcoursRs(SQLSelect($SQL));
}

function getUser($id_user){
	$id_user = proteger($id_user);
	$SQL = "select * from users where id='$id_user'";
	return parcoursRs(SQLSelect($SQL));
}

function getConversation($id_group){
	$id_group = proteger($id_group);
	$SQL = "select * from messages where group_id='$id_group'";
	return parcoursRs(SQLSelect($SQL));
}

function sendMessage($id_user, $id_group, $message){
	$id_user = proteger($id_user);
	$id_group = proteger($id_group);
	$message = proteger($message);
	$SQL = "insert into messages (group_id, user_id, content) values ('$id_group', '$id_user', '$message')";
	return SQLInsert($SQL);
}

function verifUserBdd($login,$password){
	$login = proteger($login); 
	$password = proteger($password); 
	$SQL = "select id from users where username='$login' and password='$password'";
	return SQLGetChamp($SQL);
}

function betEmotion($id_user, $friend_id_user, $emotion, $date){
	$id_user = proteger($id_user);
	$friend_id_user = proteger($friend_id_user);
	$emotion = proteger($emotion);
	$SQL = "insert into paris (user_id, friend_user_id, emotion, date_pari) values ('$id_user', '$friend_id_user', '$emotion', '$date');";
	return SQLInsert($SQL);
}

function updateEmotion($id_user, $friend_id_user, $emotion, $date){
	$id_user = proteger($id_user);
	$friend_id_user = proteger($friend_id_user);
	$emotion = proteger($emotion);
	$date = proteger($date);
	$SQL = "update paris set emotion='$emotion' where date_pari='$date' and user_id='$id_user' and friend_user_id='$friend_id_user';";
	return SQLUpdate($SQL);
}

function getDayBet($id_user, $friend_id_user, $date){
	$id_user = proteger($id_user);
	$friend_id_user = proteger($friend_id_user);
	$date = proteger($date);
	$SQL = "select * from paris where user_id='$id_user' and friend_user_id='$friend_id_user' and date_pari='$date';";
	return parcoursRs(SQLSelect($SQL));
}

function setEmotion($id_user, $emotion){
	$id_user = proteger($id_user);
	$emotion = proteger($emotion);
	$SQL = "insert into real_emotions (user_id, emotion) values ('$id_user', '$emotion')";
	return SQLInsert($SQL);
}

function getDayEmotion($id_user, $date){
	$id_user = proteger($id_user);
	$date = proteger($date);
	$SQL = "select * from real_emotions where user_id='$id_user' and date_emotion='$date';";
	return parcoursRs(SQLSelect($SQL));
}

function getPreviousEmotions($id_user, $date){
	$id_user = proteger($id_user);
	$date = proteger($date);
 	$SQL = "select * from real_emotions where user_id='$id_user' and date_emotion<='$date' order by date_emotion desc limit 7;";
	return parcoursRs(SQLSelect($SQL));
}

?>
