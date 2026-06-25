<?php
// Ce fichier permet de tester les fonctions développées dans le fichier bdd.php (première partie)

// Si la page est appelée directement par son adresse, on redirige en passant par la page index
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

<script src="js/jquery-3.5.1.min.js"></script>

<div id="corps">
    <h1>Leaderboard</h1>
</div>

<div id="leaderboard-box">

    <h2>Mes groupes</h2>
    
    <div class="group-buttons">
        <?php foreach($groupes as $g){ ?>
            <button onclick="chargerLeaderboard(<?= $g['id'] ?>)">
                <?= htmlspecialchars($g["name"]) ?>
            </button>
        <?php } ?>
    </div>

    <div id="leaderboard">
        <p class="select-group-msg">Sélectionnez un groupe pour afficher son classement.</p>
    </div>

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

            // --- Le Podium ---
            html += '<div class="podium">';

            // 2ème place
            if (joueurs.length >= 2) {
                html += `
                <div class="podium-place second">
                    <div class="medal">🥈</div>
                    <strong>${joueurs[1].username}</strong>
                    <span class="podium-pts">${joueurs[1].points} pts</span>
                </div>
                `;
            }

            // 1ère place
            if (joueurs.length >= 1) {
                html += `
                <div class="podium-place first">
                    <div class="medal">🥇</div>
                    <strong>${joueurs[0].username}</strong>
                    <span class="podium-pts">${joueurs[0].points} pts</span>
                </div>
                `;
            }

            // 3ème place
            if (joueurs.length >= 3) {
                html += `
                <div class="podium-place third">
                    <div class="medal">🥉</div>
                    <strong>${joueurs[2].username}</strong>
                    <span class="podium-pts">${joueurs[2].points} pts</span>
                </div>
                `;
            }

            html += '</div>';

            // --- Liste complète ---
            html += '<h3>Classement complet</h3>';
            html += '<div class="players-list">';

            joueurs.forEach(function(joueur, index)
            {
                // Petite distinction visuelle si c'est le joueur en cours ou un top 3
                let specialClass = "";
                if (index === 0) specialClass = "rank-1";
                else if (index === 1) specialClass = "rank-2";
                else if (index === 2) specialClass = "rank-3";

                html += `
                <div class="player-card ${specialClass}">
                    <span class="rank">#${index + 1}</span>
                    <span class="player-name">${joueur.username}</span>
                    <span class="points">${joueur.points} pts</span>
                </div>
                `;
            });

            html += '</div>'; // .players-list
            html += '</div>'; // .leaderboard-container

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
/* ==========================================================================
   MODULE LEADERBOARD / CLASSEMENT
   ========================================================================== */
#leaderboard-box {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 25px;
    box-sizing: border-box;
    width: 90%; 
    max-width: 1200px; 
    margin: 30px auto; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

#leaderboard-box h2, 
.leaderboard-container h3 {
    font-size: 1.2rem;
    color: #2d3748;
    margin-top: 0;
    margin-bottom: 15px;
    border-left: 4px solid #4a90e2;
    padding-left: 10px;
}

.select-group-msg {
    color: #a0aec0;
    font-size: 0.95rem;
    font-style: italic;
    text-align: center;
    margin: 20px 0;
}

/* Zone des boutons de groupes */
.group-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.group-buttons button {
    padding: 10px 18px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    background: #f8fafc;
    color: #4a5568;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.group-buttons button:hover {
    background: #4a90e2;
    color: white;
    border-color: #4a90e2;
}

/* Conteneur des résultats générés */
.leaderboard-container {
    max-width: 700px;
    margin: 0 auto;
}

/* ==========================================================================
   LE PODIUM GRAPHIQUE
   ========================================================================== */
.podium {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 15px;
    margin-top: 10px;
    margin-bottom: 40px;
    padding-bottom: 10px;
    border-bottom: 2px dashed #edf2f7;
}

.podium-place {
    text-align: center;
    border-radius: 12px 12px 8px 8px;
    padding: 15px 10px;
    width: 130px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.podium-place strong {
    font-size: 0.95rem;
    word-break: break-all;
    margin-bottom: 4px;
}

.podium-pts {
    font-size: 0.85rem;
    font-weight: 700;
}

.medal {
    font-size: 2rem;
    margin-bottom: 8px;
}

/* Hauteurs et couleurs thématiques du podium */
.first {
    background: #fef3c7;
    color: #92400e;
    border: 2px solid #fcd34d;
    height: 180px;
}
.first .podium-pts { color: #b45309; }

.second {
    background: #f1f5f9;
    color: #334155;
    border: 2px solid #cbd5e1;
    height: 145px;
}
.second .podium-pts { color: #475569; }

.third {
    background: #ffedd5;
    color: #9a3412;
    border: 2px solid #fed7aa;
    height: 125px;
}
.third .podium-pts { color: #c2410c; }

/* ==========================================================================
   CARTES DES JOUEURS (LISTE COMPLÈTE)
   ========================================================================== */
.players-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.player-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    transition: transform 0.15s;
}

.player-card:hover {
    transform: translateX(4px);
}

.rank {
    font-weight: 700;
    font-size: 0.95rem;
    color: #718096;
    width: 40px;
}

.player-name {
    flex: 1;
    font-weight: 600;
    color: #2d3748;
}

.points {
    font-weight: 700;
    color: #4a90e2; /* Harmonisation avec le bleu général */
    background-color: #e8f0fe;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.85rem;
}

/* Distinctions subtiles dans la liste pour le top 3 */
.rank-1 { border-left: 4px solid #fcd34d; background-color: #fffdf5; }
.rank-1 .rank { color: #b45309; }

.rank-2 { border-left: 4px solid #cbd5e1; background-color: #fafbfc; }
.rank-2 .rank { color: #475569; }

.rank-3 { border-left: 4px solid #fed7aa; background-color: #fffaf5; }
.rank-3 .rank { color: #c2410c; }
</style>