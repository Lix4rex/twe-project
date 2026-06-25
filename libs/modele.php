<?php

/*
Dans ce fichier, on définit diverses fonctions permettant de récupérer des données utiles pour notre TP d'identification. Deux parties sont à compléter, en suivant les indications données dans le support de TP
*/


/********* EXERCICE 2 : prise en main de la base de données *********/

include_once "libs/maLibSQL.pdo.php";

// inclure ici la librairie faciliant les requêtes SQL (en veillant à interdire les inclusions multiples)


function getGroups($id_user){
	$id_user = proteger($id_user);
	$SQL = "select `groups`.* from `groups` join group_members on group_members.group_id=`groups`.id where group_members.user_id='$id_user'";
	return parcoursRs(SQLSelect($SQL));
}

function getGroup($id_group){
	$id_group = proteger($id_group);
	$SQL = "select * from `groups` where id='$id_group'";
	return parcoursRs(SQLSelect($SQL));
}

function getGroupUsers($id_group){
	$id_group = proteger($id_group);
	$SQL = "select * from group_members where group_id='$id_group'";
	return parcoursRs(SQLSelect($SQL));
}

function getGroupsTwoUsers($id_user_1, $id_user_2){
	$id_user_1 = proteger($id_user_1);
	$id_user_2 = proteger($id_user_2);
	$SQL = "select gm1.group_id from group_members gm1 join group_members gm2 on gm1.group_id = gm2.group_id where gm1.user_id='$id_user_1' and gm2.user_id='$id_user_2';";
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

// Vérifie si un username est déjà pris (renvoie l'id si oui, false sinon)
function usernameExisteBdd($username){
	$username = proteger($username);
	$SQL = "select id from users where username='$username'";
	return SQLGetChamp($SQL);
}

// Crée un nouvel utilisateur dans la base, renvoie l'id inséré
function creerUserBdd($first_name, $last_name, $username, $password){
	$first_name = proteger($first_name);
	$last_name  = proteger($last_name);
	$username   = proteger($username);
	$password   = proteger($password);
	$SQL = "insert into users (first_name, last_name, username, password) values ('$first_name', '$last_name', '$username', '$password')";
	return SQLInsert($SQL);
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

function getBetOnUser($id_user){
	$id_user = proteger($id_user);
	$SQL = "select * from paris where user_id='$id_user';";
	return parcoursRs(SQLSelect($SQL));
}

function setPoints($id_user, $id_group, $points){
	$id_user = proteger($id_user);
	$id_group = proteger($id_group);
	$points = proteger($points);
	$SQL = "update group_members set points='$points' where user_id='$id_user' and group_id='$id_group';";
	return SQLUpdate($SQL);
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

/********* HISTORIQUE METEO *********/
// Même principe que les paris : un enregistrement par (utilisateur, ville, jour).

// Enregistre la météo du jour pour une ville (comme betEmotion enregistre un pari)
function saveWeatherDay($id_user, $city, $country, $temperature, $description, $humidity, $wind_speed, $date){
	$id_user = proteger($id_user);
	$city = proteger($city);
	$country = proteger($country);
	$temperature = proteger($temperature);
	$description = proteger($description);
	$humidity = proteger($humidity);
	$wind_speed = proteger($wind_speed);
	$date = proteger($date);
	$SQL = "insert into weather_history (user_id, city, country, temperature, description, humidity, wind_speed, date_meteo)
	        values ('$id_user', '$city', '$country', '$temperature', '$description', '$humidity', '$wind_speed', '$date')";
	return SQLInsert($SQL);
}

// Met à jour la météo déjà enregistrée pour ce jour et cette ville (comme updateEmotion)
function updateWeatherDay($id_user, $city, $country, $temperature, $description, $humidity, $wind_speed, $date){
	$id_user = proteger($id_user);
	$city = proteger($city);
	$country = proteger($country);
	$temperature = proteger($temperature);
	$description = proteger($description);
	$humidity = proteger($humidity);
	$wind_speed = proteger($wind_speed);
	$date = proteger($date);
	$SQL = "update weather_history
	        set country='$country', temperature='$temperature', description='$description', humidity='$humidity', wind_speed='$wind_speed'
	        where user_id='$id_user' and city='$city' and date_meteo='$date'";
	return SQLUpdate($SQL);
}

// Récupère la météo enregistrée pour un jour donné et une ville (comme getDayBet)
function getWeatherDay($id_user, $city, $date){
	$id_user = proteger($id_user);
	$city = proteger($city);
	$date = proteger($date);
	$SQL = "select * from weather_history where user_id='$id_user' and city='$city' and date_meteo='$date'";
	return parcoursRs(SQLSelect($SQL));
}

// Récupère l'historique météo des 7 derniers jours pour une ville (comme getPreviousEmotions)
function getPreviousWeather($id_user, $city, $date){
	$id_user = proteger($id_user);
	$city = proteger($city);
	$date = proteger($date);
	$SQL = "select * from weather_history where user_id='$id_user' and city='$city' and date_meteo<='$date' order by date_meteo desc limit 7";
	return parcoursRs(SQLSelect($SQL));
}

/********* GESTION DES AMIS *********/

// Recherche un utilisateur par son username (recherche exacte, insensible à la casse)
function getUserByUsername($username){
	$username = proteger($username);
	$SQL = "select * from users where username='$username'";
	return parcoursRs(SQLSelect($SQL));
}

// Recherche des utilisateurs par prénom ou nom (pour les suggestions d'ajout d'ami).
// On exclut l'utilisateur courant. Renvoie id, username, first_name, last_name.
function searchUsers($id_user, $term){
	$id_user = proteger($id_user);
	$term = proteger($term);
	$SQL = "select id, username, first_name, last_name from users
	        where id <> '$id_user'
	        and (first_name like '%$term%'
	             or last_name like '%$term%'
	             or concat(first_name, ' ', last_name) like '%$term%'
	             or username like '%$term%')
	        order by first_name, last_name
	        limit 10";
	return parcoursRs(SQLSelect($SQL));
}

// Envoie une demande d'ami (status = pending) de $id_user vers le user dont le username est $friend_username
function sendFriendRequest($id_user, $friend_username){
	$id_user = proteger($id_user);
	$friend_username = proteger($friend_username);

	$friend = getUserByUsername($friend_username);
	if (empty($friend)) return ["success" => false, "error" => "Utilisateur introuvable"];

	$friend_id = $friend[0]["id"];

	if ($friend_id == $id_user) return ["success" => false, "error" => "Impossible de s'ajouter soi-même"];

	// Vérifie qu'une relation (dans un sens ou dans l'autre) n'existe pas déjà
	$SQL = "select * from friends where (user_id='$id_user' and friend_id='$friend_id') or (user_id='$friend_id' and friend_id='$id_user')";
	$existing = parcoursRs(SQLSelect($SQL));
	if (!empty($existing)) return ["success" => false, "error" => "Une demande ou une amitié existe déjà avec cet utilisateur"];

	$SQL = "insert into friends (user_id, friend_id, status) values ('$id_user', '$friend_id', 'pending')";
	SQLInsert($SQL);
	return ["success" => true];
}

// Accepte une demande d'ami reçue (id_friendship = id de la ligne dans la table friends)
function acceptFriendRequest($id_user, $id_friendship){
	$id_user = proteger($id_user);
	$id_friendship = proteger($id_friendship);
	$SQL = "update friends set status='accepted' where id='$id_friendship' and friend_id='$id_user' and status='pending'";
	return SQLUpdate($SQL);
}

// Rejette une demande d'ami reçue, ou annule une demande envoyée (suppression de la ligne)
function rejectFriendRequest($id_user, $id_friendship){
	$id_user = proteger($id_user);
	$id_friendship = proteger($id_friendship);
	$SQL = "delete from friends where id='$id_friendship' and (user_id='$id_user' or friend_id='$id_user')";
	return SQLDelete($SQL);
}

// Supprime un ami (relation déjà acceptée), à partir de l'id de l'ami (id de users, pas de friends)
function removeFriend($id_user, $friend_id_user){
	$id_user = proteger($id_user);
	$friend_id_user = proteger($friend_id_user);
	$SQL = "delete from friends where status='accepted' and ((user_id='$id_user' and friend_id='$friend_id_user') or (user_id='$friend_id_user' and friend_id='$id_user'))";
	return SQLDelete($SQL);
}

// Liste des amis confirmés (status accepted), dans les deux sens
function getFriends($id_user){
	$id_user = proteger($id_user);
	$SQL = "select u.id, u.username, u.first_name, u.last_name, f.id as friendship_id
			from friends f
			join users u on (u.id = if(f.user_id='$id_user', f.friend_id, f.user_id))
			where f.status='accepted' and (f.user_id='$id_user' or f.friend_id='$id_user')";
	return parcoursRs(SQLSelect($SQL));
}

// Demandes reçues en attente (quelqu'un veut devenir ami avec $id_user)
function getPendingFriendRequests($id_user){
	$id_user = proteger($id_user);
	$SQL = "select f.id as friendship_id, u.id, u.username, u.first_name, u.last_name
			from friends f
			join users u on u.id = f.user_id
			where f.friend_id='$id_user' and f.status='pending'";
	return parcoursRs(SQLSelect($SQL));
}

// Demandes envoyées par $id_user, toujours en attente
function getSentFriendRequests($id_user){
	$id_user = proteger($id_user);
	$SQL = "select f.id as friendship_id, u.id, u.username, u.first_name, u.last_name
			from friends f
			join users u on u.id = f.friend_id
			where f.user_id='$id_user' and f.status='pending'";
	return parcoursRs(SQLSelect($SQL));
}

/********* GESTION DES GROUPES ENTRE AMIS *********/

// Vérifie que $id_user et $friend_id_user sont bien amis (relation acceptée)
function areFriends($id_user, $friend_id_user){
	$id_user = proteger($id_user);
	$friend_id_user = proteger($friend_id_user);
	$SQL = "select * from friends where status='accepted' and ((user_id='$id_user' and friend_id='$friend_id_user') or (user_id='$friend_id_user' and friend_id='$id_user'))";
	$res = parcoursRs(SQLSelect($SQL));
	return !empty($res);
}

// Crée un groupe et y ajoute automatiquement le créateur comme membre
// $friend_ids est un tableau d'ids d'utilisateurs (doivent être des amis du créateur)
function createGroup($name, $id_user, $friend_ids = []){
	$id_user_p = proteger($id_user);
	$name_p = proteger($name);

	if (trim($name) === "") return ["success" => false, "error" => "Le nom du groupe est obligatoire"];

	$id_group = SQLInsert("insert into `groups` (name) values ('$name_p')");
	if (!$id_group) return ["success" => false, "error" => "Erreur lors de la création du groupe"];

	SQLInsert("insert into group_members (user_id, group_id) values ('$id_user_p', '$id_group')");

	foreach ($friend_ids as $friend_id){
		$friend_id = (int) $friend_id;
		// On ne peut ajouter que des amis confirmés au groupe
		if (areFriends($id_user, $friend_id)){
			addGroupMember($id_group, $friend_id);
		}
	}

	return ["success" => true, "id_group" => $id_group];
}

// Ajoute un membre à un groupe (sans vérification d'amitié, utilisé en interne / par createGroup)
function addGroupMember($id_group, $id_user){
	$id_group = proteger($id_group);
	$id_user = proteger($id_user);

	// Évite les doublons (un même user_id/group_id ne peut être inséré deux fois, cf contrainte UNIQUE)
	$SQL = "select * from group_members where user_id='$id_user' and group_id='$id_group'";
	$existing = parcoursRs(SQLSelect($SQL));
	if (!empty($existing)) return false;

	$SQL = "insert into group_members (user_id, group_id) values ('$id_user', '$id_group')";
	return SQLInsert($SQL);
}

// Ajoute un ami à un groupe existant, en vérifiant que celui qui ajoute fait bien partie du groupe
// et que la personne ajoutée est bien un ami de celui qui l'ajoute
function addFriendToGroup($id_user, $id_group, $friend_id_user){
	$id_user = proteger($id_user);
	$id_group = proteger($id_group);
	$friend_id_user = proteger($friend_id_user);

	// Celui qui fait l'action doit être membre du groupe
	$SQL = "select * from group_members where user_id='$id_user' and group_id='$id_group'";
	$isMember = parcoursRs(SQLSelect($SQL));
	if (empty($isMember)) return ["success" => false, "error" => "Vous ne faites pas partie de ce groupe"];

	if (!areFriends($id_user, $friend_id_user)) return ["success" => false, "error" => "Cette personne n'est pas dans vos amis"];

	$ok = addGroupMember($id_group, $friend_id_user);
	if ($ok === false) return ["success" => false, "error" => "Cet utilisateur est déjà dans le groupe"];

	return ["success" => true];
}

function getUserCalendar($id_user, $date){
	$id_user = proteger($id_user);
	$date = proteger($date);

	$date_fin = date('Y-m-d', strtotime($date . ' +6 days'));

	$SQL = "select * from planning_events where user_id='$id_user' and date_event BETWEEN '$date' and '$date_fin' order by date_event, heure_debut";
	return parcoursRs(SQLSelect($SQL));
}

function updateTitleCalendar($event_id, $title){
	$event_id = proteger($event_id);
	$title = proteger($title);

	$SQL = "update planning_events set titre='$title' where id='$event_id';";
	return SQLUpdate($SQL);
}

function updateDescriptionCalendar($event_id, $description){
	$event_id = proteger($event_id);
	$description = proteger($description);

	$SQL = "update planning_events set description='$description' where id='$event_id';";
	return SQLUpdate($SQL);
}

function updateHourCalendar($event_id, $heure_debut, $heure_fin){
	$event_id = proteger($event_id);
	$heure_debut = proteger($heure_debut);
	$heure_fin = proteger($heure_fin);

	$SQL = "update planning_events set heure_debut='$heure_debut', heure_fin='$heure_fin' where id='$event_id';";
	return SQLUpdate($SQL);
}

function deleteEventCalendar($event_id){
	$event_id = proteger($event_id);
	$SQL = "delete from planning_events where id='$event_id'";
	return SQLDelete($SQL);
}

function createEventCalendar($id_user, $date_event){
	$id_user = proteger($id_user);
	$date_event = proteger($date_event);
	$SQL = "insert into planning_events (user_id, date_event, titre, description, heure_debut, heure_fin) values ('$id_user', '$date_event', 'Titre', 'Description', '00:00:00', '00:00:00');";
	return SQLInsert($SQL);
}

function isUserInGroup($id_user, $id_group)
{
	$id_user = proteger($id_user);
	$id_group = proteger($id_group);

	$SQL = "SELECT COUNT(*) 
			FROM group_members
			WHERE user_id='$id_user'
			AND group_id='$id_group'";

	return SQLGetChamp($SQL) > 0;
}

function getLeaderboard($id_group){

	$id_group = proteger($id_group);

	$SQL = "
		select users.username,
			   group_members.points
		from group_members
		join users
			on users.id = group_members.user_id
		where group_members.group_id='$id_group'
		order by group_members.points desc
	";

	return parcoursRs(SQLSelect($SQL));
// Quitte un groupe : retire l'utilisateur de la table group_members
function leaveGroup($id_user, $id_group){
	$id_user = proteger($id_user);
	$id_group = proteger($id_group);
	$SQL = "delete from group_members where user_id='$id_user' and group_id='$id_group'";
	return SQLDelete($SQL);
}

/********* SUPPRESSION DU COMPTE *********/

// Supprime définitivement un utilisateur ainsi que toutes ses données liées.
// On supprime d'abord les lignes qui référencent l'utilisateur (clés étrangères),
// puis l'utilisateur lui-même.
function supprimerUserBdd($id_user){
	$id_user = proteger($id_user);

	SQLDelete("delete from messages where user_id='$id_user'");
	SQLDelete("delete from paris where user_id='$id_user' or friend_user_id='$id_user'");
	SQLDelete("delete from real_emotions where user_id='$id_user'");
	SQLDelete("delete from friends where user_id='$id_user' or friend_id='$id_user'");
	SQLDelete("delete from group_members where user_id='$id_user'");

	return SQLDelete("delete from users where id='$id_user'");
}

?>
