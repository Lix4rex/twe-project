<?php
// Ce fichier permet de tester les fonctions développées dans le fichier bdd.php (première partie)

// Si la page est appelée directement par son adresse, on redirige en passant pas la page index
if (basename($_SERVER["PHP_SELF"]) == "Leaderboard.php")
{
	header("Location:../index.php?view=Leaderboard");
	die("");
}

session_start(); //a voir si je garde ca 

$id_user = $_SESSION["id"];

$groupes = getGroups($id_user);

include_once("libs/modele.php");
include_once("libs/maLibUtils.php"); // tprint

?>

<h1>Leaderboard</h1>

<h2>Mes groupes</h2>

<?php foreach($groupes as $g){ ?>
	<button onclick="chargerLeaderboard(<?= $g['id'] ?>)">
		<?= htmlspecialchars($g["nom"]) ?>
	</button>
<?php } ?>

<hr>

<div id="leaderboard">
	Clique sur un groupe
</div>



<?php   //pour la liste des groupes 

$id_user = $_SESSION["id"];
$id_group = intval($_GET["groupe"]);

if(!isUserInGroup($id_user, $id_group)){
	die("Accès refusé");
}

$joueurs = getLeaderboard($id_group);

echo "<table>";
echo "<tr><th>Rang</th><th>Nom</th><th>Points</th></tr>";

$rang = 1;

foreach($joueurs as $j){
	echo "<tr>";
	echo "<td>$rang</td>";
	echo "<td>".htmlspecialchars($j["username"])."</td>";
	echo "<td>".$j["points"]."</td>";
	echo "</tr>";
	$rang++;
}

echo "</table>";


