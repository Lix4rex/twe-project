<?php
// Ce fichier permet de tester les fonctions développées dans le fichier bdd.php (première partie)

// Si la page est appelée directement par son adresse, on redirige en passant pas la page index
if (basename($_SERVER["PHP_SELF"]) == "leaderboard.php")
{
	header("Location:../index.php?view=leaderboard");
	die("");
}

include_once "libs/maLibUtils.php";
include_once "libs/maLibSQL.pdo.php";
include_once "libs/maLibSecurisation.php"; 
include_once "libs/modele.php"; 



$id_user = $_SESSION["idUser"];

$groupes = getGroups($id_user);


?>

<script src="js/jquery-3.5.1.min.js">
// rien ici ! 
</script>


<h1>Leaderboard</h1>

<h2>Mes groupes</h2>

<?php foreach($groupes as $g){ ?>
	<button onclick="chargerLeaderboard(<?= $g['id'] ?>)">
		<?= htmlspecialchars($g["name"]) ?>
	</button>
<?php } ?>

<hr>

<div id="leaderboard">
	Clique sur un groupe
</div>

<script>

function chargerLeaderboard(idGroup)
{
    $.ajax({
        type: "GET",
        url: "controleur.php",
        data: {
            action: "get_leaderboard",
            id: idGroup
        },
        dataType: "json",

        success: function(joueurs)
        {
            let html = "<table>";
            html += "<tr><th>Rang</th><th>Nom</th><th>Points</th></tr>";

            let rang = 1;

            joueurs.forEach(function(j){
                html += "<tr>";
                html += "<td>" + rang + "</td>";
                html += "<td>" + j.username + "</td>";
                html += "<td>" + j.points + "</td>";
                html += "</tr>";
                rang++;
            });

            html += "</table>";

            $("#leaderboard").html(html);
        },

        error: function(xhr, status, error)
        {
            console.log("ERROR:", error);
        }
    });
}

</script>

<?php   //pour la liste des groupes 

$id_user = $_SESSION["idUser"];
if(isset($_GET["id"]))
{
	$id_group = intval($_GET["id"]);
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
}







