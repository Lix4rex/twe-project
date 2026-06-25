<?php

// Si la page est appelée directement par son adresse, on redirige en passant pas la page index
if (basename($_SERVER["PHP_SELF"]) != "index.php")
{
	header("Location:../index.php?view=login");
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

	#formLogin input[type="text"],
	#formLogin input[type="password"] {
		width: 100%;
		padding: 10px 12px;
		margin-top: 6px;
		margin-bottom: 20px;
		border: 1px solid #cbd5e0;
		border-radius: 6px;
		font-family: inherit;
		font-size: 1rem;
		color: #333333;
		background-color: #ffffff;
		box-sizing: border-box;
	}

	#formLogin input[type="text"]:focus,
	#formLogin input[type="password"]:focus {
		border-color: #4a90e2;
		outline: none;
		background-color: #f7fafc;
	}

	#formLogin input[type="submit"] {
		background-color: #ff6b6b; 
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
	}

	#formLogin input[type="submit"]:hover {
		background-color: #e05353;
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

<h1>Connexion</h1>

<div id="formLogin">
<form action="controleur.php" method="GET">
Login : <input type="text" name="username" /><br />
Passe : <input type="password" name="password" /><br />
<input type="submit" name="action" value="login" />
</form>
</div>

<p>Pas encore de compte ? <a href="index.php?view=register">Créer un compte</a></p>


</div>
