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

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js">
</script>

<script src="js/conversations.js?v=7">
</script>

<div id="corps">
	<h1>Conversations</h1>
</div>

<div id="main_box">
	<div id="groups">
		<div id="groups-list">
		</div>
		<input type="submit" id="show-create-group-btn" value="+ Créer un groupe" />
		<div id="create-group-form" style="display:none;">
			<input type="text" id="new-group-name" placeholder="Nom du groupe" />
			<div id="friends-checklist">
			</div>
			<input type="submit" id="confirm-create-group-btn" value="Créer" />
			<p id="create-group-message"></p>
		</div>
	</div>

	<div id="conversation">
	</div>
</div>