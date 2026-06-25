<?php
session_start();

	include_once "libs/maLibUtils.php";
	include_once "libs/maLibSQL.pdo.php";
	include_once "libs/maLibSecurisation.php"; 
	include_once "libs/modele.php"; 

	date_default_timezone_set("Europe/Paris");

	$qs = "";

	if ($action = valider("action"))
	{
		ob_start ();

		echo "Action = '$action' <br />";

		// ATTENTION : le codage des caractères peut poser PB 
		// si on utilise des actions comportant des accents... 
		// A EVITER si on ne maitrise pas ce type de problématiques

		/* TODO: exercice 4
		// Dans tous les cas, il faut etre logue... 
		// Sauf si on veut se connecter (action == Connexion)

		if ($action != "Connexion") 
			securiser("login");
		*/

		// Un paramètre action a été soumis, on fait le boulot...
		switch($action)
		{

			case 'login' :
				if ($username = valider("username"))
				if ($password = valider("password"))
				{
					verifUser($username,$password); 	
				}
			break;

			case 'register' :
				$first_name = valider("first_name");
				$last_name  = valider("last_name");
				$username   = valider("username");
				$password   = valider("password");

				if ($first_name && $last_name && $username && $password)
				{
					if (!creerUser($first_name, $last_name, $username, $password)){
						// Echec (username déjà pris ou champ invalide) :
						// on revient sur le formulaire avec un message d'erreur
						$_SESSION["erreurInscription"] = "Ce nom d'utilisateur est déjà pris ou les informations sont invalides.";
						$qs = "?view=register";
					}
				}
				else {
					$_SESSION["erreurInscription"] = "Tous les champs sont obligatoires.";
					$qs = "?view=register";
				}
			break;

			case 'logout':
				session_unset();
				$_SESSION["connecte"] = false;
			break;

			case 'delete_account':
				$id_user = $_SESSION["idUser"];
				if ($id_user){
					supprimerUserBdd($id_user);
				}
				// On déconnecte l'utilisateur, comme pour logout
				session_unset();
				$_SESSION["connecte"] = false;
				$qs='?view=accueil';
			break;

			case 'get_groups':
				$id_user = $_SESSION["idUser"];
				$groups = getGroups($id_user); 
				// On répond en JSON et on arrête le script ici
				ob_clean();
				header("Content-Type: application/json");
				echo json_encode($groups);
				exit;
			break;

			case 'get_group':
				if ($id_group = valider("id_group", "GET")){
					$group = getGroup($id_group);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($group);
					exit;
				}
			break;

			case 'get_group_users':
				if ($id_group = valider("id_group", "GET")){
					$group_users = getGroupUsers($id_group);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($group_users);
					exit;
				}
			break;

			case 'get_group_two_users':
				$id_user_1 = $_SESSION["idUser"];
				if ($id_user_2 = valider("id_user", "GET")){
					$groups = getGroupsTwoUsers($id_user_1, $id_user_2);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($groups);
					exit;
				}
			break;

			case 'set_points':
				if ($id_user = valider("id_user", "GET"))
				if ($id_group = valider("id_group", "GET"))
				if ($points = valider("points", "GET")){
					$data = setPoints($id_user, $id_group, $points);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($data);
					exit;
				}
			break;

			case 'get_user':
				if ($id_user = valider("id_user", "GET")){
					$user = getUser($id_user); 
					// On répond en JSON et on arrête le script ici
					ob_clean();
					header("Content-Type: application/json");
					$user["connected_user_id"] = $_SESSION["idUser"];
					echo json_encode($user);
					exit;
				}
				else{
					if ($_SESSION["connecte"]){
						$id_user = $_SESSION["idUser"];
						$user = getUser($id_user); 
						// On répond en JSON et on arrête le script ici
						ob_clean();
						header("Content-Type: application/json");
						echo json_encode($user);
						exit;
					}
				}
			break;

			case 'get_conversation':
				if ($id_group = valider("id_group", "GET")){
					$conversations = getConversation($id_group);
					// On répond en JSON et on arrête le script ici
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($conversations);
					exit;
				}
			break;

			case 'send_message':
				$id_user = $_SESSION["idUser"];
				if ($id_group = valider("id_group", "GET"))
				if ($message = valider("message", "GET")){
					sendMessage($id_user, $id_group, $message);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode([
						"success" => true
					]);
					exit;
				}
			break;

			case 'get_tommorow_bet':
				if ($friend_id_user = valider("friend_id_user", "GET")){
					$date = (new DateTime('tomorrow'))->format('Y-m-d');
					$id_user = $_SESSION["idUser"];
					$bet = getDayBet($id_user, $friend_id_user, $date);
					// On répond en JSON et on arrête le script ici
					ob_clean();
					header("Content-Type: application/json");
					$bet["next_day"]=$date;
					$bet["id_user"] = $id_user;
					echo json_encode($bet);
					exit;
				}
			break;

			case 'send_day_bet':
				
				$id_user = $_SESSION["idUser"];
				if ($friend_id_user = valider("friend_id_user", "GET"))
				if ($emotion = valider("emotion", "GET")){
					$date = (new DateTime('tomorrow'))->format('Y-m-d');
					betEmotion($id_user, $friend_id_user, $emotion, $date);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode([
						"success" => true
					]);
					exit;
				}
			break;

			case 'update_day_bet':
				$id_user = $_SESSION["idUser"];
				if ($friend_id_user = valider("friend_id_user", "GET"))
				if ($emotion = valider("emotion", "GET")){
					$date = (new DateTime('tomorrow'))->format('Y-m-d');
					updateEmotion($id_user, $friend_id_user, $emotion, $date);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode([
						"success" => true
					]);
					exit;
				}
			break;

			case 'get_bet_on_user':
				$id_user = $_SESSION["idUser"];
				if ($test = valider("id_user", "GET")) $id_user = $test;
				$bets = getBetOnUser($id_user);
				ob_clean();
				header("Content-Type: application/json");
				echo json_encode($bets);
				exit;

			break;

			case 'set_day_emotion':
				if ($emotion = valider("emotion", "GET")){
					$id_user = $_SESSION["idUser"];
					setEmotion($id_user, $emotion);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode([
						"success" => true
					]);
					exit;
				}
			break;

			case 'get_day_emotion':
				$id_user = $_SESSION["idUser"];
				if ($test = valider("id_user", "GET")) $id_user = $test;
				$date = date("Y-m-d");
				if ($test = valider("date_bet", "GET")) $date = $test;
				if ($id_user){
					$emotion = getDayEmotion($id_user, $date);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($emotion);
					exit;
				}
			break;

			case 'get_previous_emotions':
				if ($friend_id_user = valider("friend_id_user", "GET")){
					$date = date("Y-m-d");
					$emotions = getPreviousEmotions($friend_id_user, $date);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($emotions);
					exit;
				}
			break;

			case 'save_weather':
				$id_user = isset($_SESSION["idUser"]) ? $_SESSION["idUser"] : null;
				$city = valider("city", "GET");
				if ($id_user && $city){
					$date        = date("Y-m-d");
					$country     = valider("country", "GET");
					$temperature = valider("temperature", "GET");
					$description = valider("description", "GET");
					$humidity    = valider("humidity", "GET");
					$wind_speed  = valider("wind_speed", "GET");

					// Comme pour un pari : si la météo du jour existe déjà pour cette ville,
					// on la met à jour, sinon on l'enregistre.
					if (getWeatherDay($id_user, $city, $date)){
						updateWeatherDay($id_user, $city, $country, $temperature, $description, $humidity, $wind_speed, $date);
					} else {
						saveWeatherDay($id_user, $city, $country, $temperature, $description, $humidity, $wind_speed, $date);
					}
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode(["success" => true]);
					exit;
				}
				// Pas connecté (ou ville manquante) : on ne suit pas l'historique
				ob_clean();
				header("Content-Type: application/json");
				echo json_encode(["success" => false, "reason" => "not_logged_in"]);
				exit;
			break;

			case 'get_previous_weather':
				$id_user = isset($_SESSION["idUser"]) ? $_SESSION["idUser"] : null;
				$city = valider("city", "GET");
				$history = ($id_user && $city) ? getPreviousWeather($id_user, $city, date("Y-m-d")) : [];
				ob_clean();
				header("Content-Type: application/json");
				echo json_encode($history);
				exit;
			break;

			case 'send_friend_request':
				$id_user = $_SESSION["idUser"];
				if ($friend_username = valider("friend_username", "GET")){
					$result = sendFriendRequest($id_user, $friend_username);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($result);
					exit;
				}
			break;

			case 'accept_friend_request':
				$id_user = $_SESSION["idUser"];
				if ($id_friendship = valider("id_friendship", "GET")){
					$ok = acceptFriendRequest($id_user, $id_friendship);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode(["success" => $ok !== false]);
					exit;
				}
			break;

			case 'reject_friend_request':
				$id_user = $_SESSION["idUser"];
				if ($id_friendship = valider("id_friendship", "GET")){
					$ok = rejectFriendRequest($id_user, $id_friendship);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode(["success" => $ok !== false]);
					exit;
				}
			break;

			case 'remove_friend':
				$id_user = $_SESSION["idUser"];
				if ($friend_id_user = valider("friend_id_user", "GET")){
					$ok = removeFriend($id_user, $friend_id_user);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode(["success" => $ok !== false]);
					exit;
				}
			break;

			case 'get_friends':
				$id_user = $_SESSION["idUser"];
				$friends = getFriends($id_user);
				ob_clean();
				header("Content-Type: application/json");
				echo json_encode($friends);
				exit;
			break;

			case 'search_users':
				$id_user = $_SESSION["idUser"];
				$term = valider("term", "GET");
				if (!$term) $term = "";
				$users = searchUsers($id_user, $term);
				ob_clean();
				header("Content-Type: application/json");
				echo json_encode($users);
				exit;
			break;

			case 'get_pending_friend_requests':
				$id_user = $_SESSION["idUser"];
				$requests = getPendingFriendRequests($id_user);
				ob_clean();
				header("Content-Type: application/json");
				echo json_encode($requests);
				exit;
			break;

			case 'get_sent_friend_requests':
				$id_user = $_SESSION["idUser"];
				$requests = getSentFriendRequests($id_user);
				ob_clean();
				header("Content-Type: application/json");
				echo json_encode($requests);
				exit;
			break;

			case 'create_group':
				$id_user = $_SESSION["idUser"];
				if ($group_name = valider("group_name", "GET")){
					$friend_ids = valider("friend_ids", "GET");
					$friend_ids = $friend_ids ? explode(",", $friend_ids) : [];
					$result = createGroup($group_name, $id_user, $friend_ids);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($result);
					exit;
				}
			break;

			case 'add_friend_to_group':
				$id_user = $_SESSION["idUser"];
				if ($id_group = valider("id_group", "GET"))
				if ($friend_id_user = valider("friend_id_user", "GET")){
					$result = addFriendToGroup($id_user, $id_group, $friend_id_user);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($result);
					exit;
				}
			break;

			case 'get_user_calendar':
				$id_user = $_SESSION["idUser"];
				if ($test = valider("id_user", "GET")) $id_user = $test;
				$date = (new DateTime())->modify('monday this week')->format('Y-m-d');
				if ($test = valider("date", "GET")) $date = $test;
				$user_calendar = getUserCalendar($id_user, $date);
				ob_clean();
				header("Content-Type: application/json");
				echo json_encode($user_calendar);
				exit;
			break;

			case 'update_title_calendar':
				if ($event_id = valider("event_id", "GET"))
				if ($title = valider("title", "GET")){
					$data = updateTitleCalendar($event_id, $title);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($data);
					exit;
				}
			break;

			case 'update_description_calendar':
				if ($event_id = valider("event_id", "GET"))
				if ($description = valider("description", "GET")){
					$data = updateDescriptionCalendar($event_id, $description);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($data);
					exit;
				}
			break;

			case 'update_hour_calendar':
				if ($event_id = valider("event_id", "GET"))
				if ($heure_debut = valider("heure_debut", "GET"))
				if ($heure_fin = valider("heure_fin", "GET")){
					$data = updateHourCalendar($event_id, $heure_debut, $heure_fin);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($data);
					exit;
				}
			break;

			case 'delete_event_calendar':
				if ($event_id = valider("event_id", "GET")){
					$data = deleteEventCalendar($event_id);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($data);
					exit;
				}
			break;

			case 'create_event_calendar':
				$id_user = $_SESSION["idUser"];
				if ($date_event = valider("date_event", "GET")){
					$data = createEventCalendar($id_user, $date_event);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode($data);
					exit;
				}
			break;

			case 'get_group_leaderboard':
				$id_user = $_SESSION["idUser"];
				if ($id_group = valider("id_group", "GET")){
					if (isUserInGroup($id_user, $id_group)){
						$data = getLeaderboard($id_group);
						ob_clean();
						header("Content-Type: application/json");
						echo json_encode($data);
						exit;
					}
				}
			break;

			case 'leave_group':
				$id_user = $_SESSION["idUser"];
				if ($id_group = valider("id_group", "GET")){
					$ok = leaveGroup($id_user, $id_group);
					ob_clean();
					header("Content-Type: application/json");
					echo json_encode(["success" => $ok !== false]);
					exit;
				}
			break;
		}

	}

	// On redirige toujours vers la page index, mais on ne connait pas le répertoire de base
	// On l'extrait donc du chemin du script courant : $_SERVER["PHP_SELF"]
	// Par exemple, si $_SERVER["PHP_SELF"] vaut /chat/data.php, dirname($_SERVER["PHP_SELF"]) contient /chat

	$urlBase = dirname($_SERVER["PHP_SELF"]) . "/index.php";
	// On redirige vers la page index avec les bons arguments

	header("Location:" . $urlBase . $qs);
	//qs doit contenir le symbole '?'

	// On écrit seulement après cette entête
	ob_end_flush();
	
?>










