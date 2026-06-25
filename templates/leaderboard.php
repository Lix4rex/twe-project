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
            action: "get_group_leaderboard",
            id_group: idGroup
        },
        dataType: "json",

        success: function(joueurs)
        {
            let html = '<div class="leaderboard-container">';

            html += '<div class="podium">';

            if (joueurs.length >= 2) {
                html += `
                <div class="podium-place second">
                    <h2>🥈</h2>
                    <strong>${joueurs[1].username}</strong><br>
                    ${joueurs[1].points} pts
                </div>
                `;
            }

            if (joueurs.length >= 1) {
                html += `
                <div class="podium-place first">
                    <h1>🥇</h1>
                    <strong>${joueurs[0].username}</strong><br>
                    ${joueurs[0].points} pts
                </div>
                `;
            }

            if (joueurs.length >= 3) {
                html += `
                <div class="podium-place third">
                    <h2>🥉</h2>
                    <strong>${joueurs[2].username}</strong><br>
                    ${joueurs[2].points} pts
                </div>
                `;
            }

            html += '</div>';

            html += '<h3>Classement complet</h3>';

            joueurs.forEach(function(joueur, index)
            {
                html += `
                <div class="player-card">
                    <span class="rank">#${index + 1}</span>
                    <span>${joueur.username}</span>
                    <span class="points">${joueur.points} pts</span>
                </div>
                `;
            });

            html += '</div>';

            $("#leaderboard").html(html);
        },

        error: function(xhr, status, error)
        {
            console.log("ERROR:", error);
        }
    });
}

</script>



<style>
.group-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.group-buttons button {
    padding: 10px 15px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: #4f46e5;
    color: white;
    font-weight: bold;
}

.leaderboard-container {
    max-width: 700px;
    margin: auto;
}

.podium {
    display: flex;
    justify-content: center;
    align-items: end;
    gap: 15px;
    margin-bottom: 30px;
}

.podium-place {
    text-align: center;
    border-radius: 15px;
    padding: 15px;
    color: white;
    min-width: 120px;
}

.first {
    background: gold;
    color: black;
    height: 180px;
}

.second {
    background: silver;
    color: black;
    height: 140px;
}

.third {
    background: #cd7f32;
    height: 120px;
}

.player-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    margin: 8px 0;
    background: #f5f5f5;
    border-radius: 10px;
}

.rank {
    font-weight: bold;
    font-size: 18px;
}

.points {
    font-weight: bold;
    color: #4f46e5;
}
</style>

