<?php
// Ce fichier permet de tester les fonctions développées dans le fichier bdd.php (première partie)




// Si la page est appelée directement par son adresse, on redirige en passant pas la page index
if (basename($_SERVER["PHP_SELF"]) == "Amis.php")
{
	header("Location:../index.php?view=Amis");
	die("");
}

// Traitement des actions

if(isset($_GET["accept"]) && is_numeric($_GET["accept"]))
{
	acceptFriendRequest(
		$_GET["accept"],
		$_SESSION["id"]
	);

	header("Location:index.php?view=Amis");
	exit();
}

if(isset($_GET["reject"]) && is_numeric($_GET["reject"]))
{
	rejectFriendRequest(
		$_GET["reject"],
		$_SESSION["id"]
	);

	header("Location:index.php?view=Amis");
	exit();
}

if(isset($_GET["addFriend"])
	&& is_numeric($_GET["addFriend"]))
{
	addFriendRequest(
		$_SESSION["id"],
		$_GET["addFriend"]
	);

	header("Location:index.php?view=Amis");
	exit();
}
//ca c'est pour l'apparition des noms quand on veut rechercher 
$search = $_GET["search"];

$users = searchUsers(
	$search,
	$_SESSION["id"]
);

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

$demandes = getPendingFriendRequests($_SESSION["id"]);

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

$friends = getFriends($_SESSION["id"]);

foreach($friends as $friend)
{
	if($friend["user_id"] == $_SESSION["id"])
	{
		$id_ami = $friend["friend_user_id"];
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


<input type="text" id="rechercheUser" placeholder="Rechercher un utilisateur" onkeyup="rechercherUtilisateur()">

<div id="resultatsRecherche"></div>

<button id="btnAjouter" style="display:none;" onclick="ajouterAmi()">
	Ajouter en ami
</button>

<hr>