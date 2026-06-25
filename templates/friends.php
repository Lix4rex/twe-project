<?php

//C'est la propriété php_self qui nous l'indique : 
// Quand on vient de index : 
// [PHP_SELF] => /chatISIG/index.php 
// Quand on vient directement par le répertoire templates
// [PHP_SELF] => /chatISIG/templates/accueil.php

// Si la page est appelée directement par son adresse, on redirige en passant pas la page index
// Pas de soucis de bufferisation, puisque c'est dans le cas où on appelle directement la page sans son contexte
if (basename($_SERVER["PHP_SELF"]) != "index.php")
{
	header("Location:../index.php?view=accueil");
	die("");
}

?>

<script src="js/jquery-3.5.1.min.js">
// rien ici ! 
</script>

<script src="js/friends.js?v=2">
</script>

<div id="corps">
	<h1>Mes amis</h1>
</div>

<div id="main_box">

	<div id="add-friend-box">
		<h2>Ajouter un ami</h2>
		<input type="text" id="friend-username-input" placeholder="Nom, prénom ou nom d'utilisateur" autocomplete="off" />
		<input type="submit" id="add-friend-btn" value="Envoyer une demande" />
		<div id="friend-suggestions"></div>
		<p id="add-friend-message"></p>
	</div>

	<div id="friend-requests-box">
		<h2>Demandes reçues</h2>
		<div id="friend-requests-list"></div>
	</div>

	<div id="sent-requests-box">
		<h2>Demandes envoyées</h2>
		<div id="sent-requests-list"></div>
	</div>

	<div id="friends-list-box">
		<h2>Mes amis</h2>
		<div id="friends-list"></div>
	</div>

</div>
