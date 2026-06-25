<?php
if (basename($_SERVER["PHP_SELF"]) != "index.php")
{
    header("Location:../index.php?view=accueil");
    die("");
}
?>

<script src="js/jquery-3.5.1.min.js"></script>
<script src="js/friends.js?v=2"></script>

<div id="corps">
    <h1>Mes amis</h1>
</div>

<div id="friends-main-box">

    <div id="add-friend-box">
        <h2>Ajouter un ami</h2>
        <div id="friend-search-controls">
            <div class="search-input-wrapper">
                <input type="text" id="friend-username-input" placeholder="Nom, prénom ou nom d'utilisateur" autocomplete="off" />
                <div id="friend-suggestions"></div>
            </div>
            <input type="submit" id="add-friend-btn" value="Envoyer une demande" />
        </div>
        <p id="add-friend-message"></p>
    </div>

    <div class="friends-lists-grid">
        <div id="friend-requests-box" class="friends-card">
            <h2>Demandes reçues</h2>
            <div id="friend-requests-list"></div>
        </div>

        <div id="sent-requests-box" class="friends-card">
            <h2>Demandes envoyées</h2>
            <div id="sent-requests-list"></div>
        </div>

        <div id="friends-list-box" class="friends-card">
            <h2>Mes amis</h2>
            <div id="friends-list"></div>
        </div>
    </div>

</div>