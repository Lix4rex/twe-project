<?php

include_once "maLibUtils.php";	// Car on utilise la fonction valider()
include_once "modele.php";	// Car on utilise la fonction connecterUtilisateur()

/**
 * @file login.php
 * Fichier contenant des fonctions de vérification de logins
 */

/**
 * Cette fonction vérifie si le login/passe passés en paramètre sont légaux
 * Elle stocke les informations sur la personne dans des variables de session : session_start doit avoir été appelé...
 * Infos à enregistrer : pseudo, idUser, heureConnexion, isAdmin
 * Elle enregistre l'état de la connexion dans une variable de session "connecte" = true
 * L'heure de connexion doit être stockée au format date("H:i:s") 
 * @pre login et passe ne doivent pas être vides
 * @param string $login
 * @param string $password
 * @return false ou true ; un effet de bord est la création de variables de session
 */
function verifUser($login,$password)
{
	$login = proteger($login);
	$password = proteger($password);

	if (!$login) return false;
	if (!$password) return false;
	
	if ($idUser = verifUserBdd($login, $password)){
		$_SESSION["connecte"] = "true";
		$_SESSION["pseudo"] = $login;
		$_SESSION["idUser"] = $idUser;
		$_SESSION["heureConnexion"] = date("H:i:s");;
		return true;
	}
	return false;

}


/**
 * Cette fonction crée un nouvel utilisateur en base, puis le connecte directement
 * (mêmes variables de session que verifUser).
 * @pre tous les champs doivent être non vides
 * @param string $first_name
 * @param string $last_name
 * @param string $login
 * @param string $password
 * @return false si le username est déjà pris ou en cas d'erreur, true sinon
 */
function creerUser($first_name, $last_name, $login, $password)
{
	$first_name = proteger($first_name);
	$last_name  = proteger($last_name);
	$login      = proteger($login);
	$password   = proteger($password);

	if (!$first_name) return false;
	if (!$last_name)  return false;
	if (!$login)      return false;
	if (!$password)   return false;

	// Le username doit être unique
	if (usernameExisteBdd($login)) return false;

	if ($idUser = creerUserBdd($first_name, $last_name, $login, $password)){
		// On connecte directement le nouvel utilisateur
		$_SESSION["connecte"] = "true";
		$_SESSION["pseudo"] = $login;
		$_SESSION["idUser"] = $idUser;
		$_SESSION["heureConnexion"] = date("H:i:s");
		return true;
	}
	return false;
}




/**
 * Fonction à placer au début de chaque page privée
 * Cette fonction redirige vers la page $urlBad en envoyant un message d'erreur 
	et arrête l'interprétation si l'utilisateur n'est pas connecté
 * Elle ne fait rien si l'utilisateur est connecté, et si $urlGood est faux
 * Elle redirige vers urlGood sinon
 */
function securiser($urlBad,$urlGood=false)
{
	
}

?>
