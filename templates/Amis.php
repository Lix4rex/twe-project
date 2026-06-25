<?php
// Ce fichier permet de tester les fonctions développées dans le fichier bdd.php (première partie)




// Si la page est appelée directement par son adresse, on redirige en passant pas la page index
if (basename($_SERVER["PHP_SELF"]) == "amis.php")
{
	header("Location:../index.php?view=Amis");
	die("");
}
include_once "libs/maLibUtils.php";
	include_once "libs/maLibSQL.pdo.php";
	include_once "libs/maLibSecurisation.php"; 
	include_once "libs/modele.php"; 
// Traitement des actions

if(isset($_GET["accept"]) && is_numeric($_GET["accept"]))
{
	acceptFriendRequest(
		$_SESSION["idUser"],
		$_GET["accept"]
	);

	header("Location:index.php?view=Amis");
	exit();
}

if(isset($_GET["reject"]) && is_numeric($_GET["reject"]))
{
	rejectFriendRequest(
		$_SESSION["idUser"],
		$_GET["reject"]
	);

	header("Location:index.php?view=Amis");
	exit();
}

if(isset($_GET["addFriend"])
	&& is_numeric($_GET["addFriend"]))
{
	addFriendRequest(
		$_SESSION["idUser"],
		$_GET["addFriend"]
	);

	header("Location:index.php?view=Amis");
	exit();
}
//ca c'est pour l'apparition des noms quand on veut rechercher 

$search = "";
$users = array();

if(isset($_GET["search"]) && strlen($_GET["search"]) >= 3)
{
	$users = searchUsers(
		$_GET["search"],
		$_SESSION["idUser"]
	);
}

foreach($users as $user)
{
	echo "
	<div
		onclick='selectionnerUtilisateur(
			".$user["id"].",
			\"".$user["username"]."\"
		)'
	>
		".$user["username"]."
	</div>
	";
}

//------ ca a voir si je crée pas un autre fichier

echo "<h2>Demandes d'amis</h2>";

$demandes = getPendingFriendRequests($_SESSION["idUser"]);

if(count($demandes) == 0)
{
	echo "Aucune demande d'ami en attente.";
}
else
{
	foreach($demandes as $demande)
	{
		$user = getUser($demande["user_id"]);

		echo $user[0]["username"];

		echo " ";
		echo "<a href='index.php?view=Amis&accept=".$demande["user_id"]."'>Accepter</a>";

		echo " ";

		echo "<a href='index.php?view=Amis&reject=".$demande["user_id"]."'>Refuser</a>";

		echo "<br>";
	}
}



echo "<h2>Mes amis</h2>";

$friends = getFriends($_SESSION["idUser"]);

foreach($friends as $friend)
{
	if($friend["user_id"] == $_SESSION["idUser"])
	{
		$id_ami = $friend["friend_id"];
	}
	else
	{
		$id_ami = $friend["user_id"];
	}

	$ami = getUser($id_ami);

	echo $ami[0]["username"];
	echo "<br>";
}


?>

<input type="text" id="rechercheUser" placeholder="Rechercher un utilisateur" onkeyup="searchUsers()">

<div id="resultatsRecherche"></div>

<button id="btnAjouter" style="display:none;" onclick="ajouterAmi()">
	Ajouter en ami
</button>

<hr>
