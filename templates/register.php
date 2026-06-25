<?php

// Si la page est appelée directement par son adresse, on redirige en passant pas la page index
if (basename($_SERVER["PHP_SELF"]) != "index.php")
{
	header("Location:../index.php?view=register");
	die("");
}

?>

<div id="corps">

<h1>Créer un compte</h1>

<?php
// Affiche un éventuel message d'erreur renvoyé par le contrôleur
if (isset($_SESSION["erreurInscription"]))
{
	echo "<p style=\"color:red\">" . $_SESSION["erreurInscription"] . "</p>";
	unset($_SESSION["erreurInscription"]);
}
?>

<div id="formLogin">
<form action="controleur.php" method="GET">
Prénom : <input type="text" name="first_name" /><br />
Nom : <input type="text" name="last_name" /><br />
Login : <input type="text" name="username" /><br />
Passe : <input type="password" name="password" /><br />
<input type="submit" name="action" value="register" />
</form>
</div>


</div>
