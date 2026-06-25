<?php

// Si la page est appelée directement par son adresse, on redirige en passant par la page index
if (basename($_SERVER["PHP_SELF"]) != "index.php")
{
	header("Location:../index.php?view=weather");
	die("");
}

?>

<script src="js/jquery-3.5.1.min.js">
// rien ici !
</script>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js">
</script>

<script src="js/weather.js?v=8">
</script>

<div id="corps">
	<h1>Météo</h1>
</div>

<div id="weather-box">

	<p>Consultez la météo de la localité de votre choix, avec l'historique des jours précédents.</p>

	<div id="weather-controls">
		<input type="text" id="weather-city-input" placeholder="Nom d'une ville (ex : Lille, Paris, Tokyo...)" autocomplete="off" />
		<input type="submit" id="weather-search-btn" value="Chercher" />
	</div>

	<div id="weather-suggestions"></div>

	<p id="weather-message"></p>

	<div id="weather-result"></div>

	<div id="weather-history"></div>

</div>
