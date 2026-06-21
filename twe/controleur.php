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

			case 'logout':
				session_unset();
				$_SESSION["connecte"] = false;
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
				if ($id_user){
					$date = date("Y-m-d");
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










