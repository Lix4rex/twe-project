<?php

// Si la page est appelée directement par son adresse, on redirige en passant pas la page index
if (basename($_SERVER["PHP_SELF"]) != "index.php")
{
	header("Location:../index.php?view=register");
	die("");
}

?>

<style>
	#formLogin {
		max-width: 400px;
		margin: 30px auto;
		padding: 20px;
		background-color: #fafbfc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
	}

	#formLogin form {
		display: flex;
		flex-direction: column;
	}

	#corps p[style*="color:red"], 
	#corps p[style*="color: red"] {
		background-color: #fff5f5;
		color: #e53e3e !important; 
		border: 1px solid #fed7d7;
		padding: 12px;
		border-radius: 6px;
		max-width: 400px;
		margin: 15px auto;
		text-align: center;
		font-weight: 600;
		font-size: 0.9rem;
	}

	#formLogin input[type="text"],
	#formLogin input[type="password"] {
		width: 100%;
		padding: 10px 12px;
		margin-top: 6px;
		margin-bottom: 15px;
		border: 1px solid #cbd5e0;
		border-radius: 6px;
		box-sizing: border-box;
		font-size: 1rem;
	}

	#formLogin br {
		display: none;
	}

	#formLogin input[type="submit"] {
		background-color: #4a90e2;
		color: #ffffff;
		border: none;
		padding: 12px;
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-radius: 6px;
		cursor: pointer;
		width: 100%;
		margin-top: 10px;
	}

	#formLogin input[type="submit"]:hover {
		background-color: #357abd;
	}

	#corps p {
		text-align: center;
		margin-top: 20px;
		font-size: 0.95rem;
		color: #5c6b73;
	}

	#corps p a {
		font-weight: 600;
		color: #4a90e2;
	}

	#corps p a:hover {
		color: #357abd;
	}

	#corps h1 {
		text-align: center;
		color: #2d3748;
		font-size: 2rem;
		margin-bottom: 10px;
	}
</style>

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
<p>Déjà un compte ? <a href="index.php?view=login">Se connecter</a></p>


</div>
