<?php

/*
Dans ce fichier, on définit diverses fonctions permettant de récupérer des données utiles pour notre TP d'identification. Deux parties sont à compléter, en suivant les indications données dans le support de TP
*/


/********* EXERCICE 2 : prise en main de la base de données *********/

include_once "libs/maLibSQL.pdo.php";

// inclure ici la librairie faciliant les requêtes SQL (en veillant à interdire les inclusions multiples)


function listerUtilisateurs($classe = "both")
{
	// Cette fonction liste les utilisateurs de la base de données 
	// et renvoie un tableau d'enregistrements. 
	// Chaque enregistrement est un tableau associatif contenant les champs 
	// id,pseudo,blacklist,couleur

	// Lorsque la variable $classe vaut "both", elle renvoie tous les utilisateurs
	// Lorsqu'elle vaut "bl", elle ne renvoie que les utilisateurs blacklistés
	// Lorsqu'elle vaut "nbl", elle ne renvoie que les utilisateurs non blacklistés

	$SQL = "select * from users";
	switch ($classe){
		case "bl":
			$SQL = "select pseudo,couleur from users WHERE blacklist=1";
		break;
		case "nbl":
			$SQL = "select pseudo,couleur from users WHERE blacklist=0";
		break;
		}
	return parcoursRs(SQLSelect($SQL));

}

function interdireUtilisateur($idUser)
{
	// cette fonction affecte le booléen "blacklist" à vrai 
	$idUser = proteger($idUser); 
	$SQL = "update users set blacklist=1 WHERE id=$idUser";
	return SQLUpdate($SQL);

}

function autoriserUtilisateur($idUser)
{
	// cette fonction affecte le booléen "blacklist" à faux 
	$idUser = proteger($idUser); 
	$SQL = "update users set blacklist=0 WHERE id=$idUser";
	return SQLUpdate($SQL);

}

function changerCouleur($couleur, $idUser){
	$couleur = proteger($couleur);
	$idUser = proteger($idUser);
	$SQL = "update users set couleur='$couleur' where id='$idUser'";
	return SQLUpdate($SQL);
}

/********* EXERCICE 4 *********/

function verifUserBdd($login,$passe)
{
	$login = proteger($login); 
	$passe = proteger($passe); 
	$SQL = "select id from users where pseudo='$login' and passe='$passe'";
	print $SQL;
	return SQLGetChamp($SQL);
	// Vérifie l'identité d'un utilisateur 
	// dont les identifiants sont passes en paramètre
	// renvoie faux si user inconnu
	// renvoie l'id de l'utilisateur si succès


	// On utilise SQLGetCHamp
	// si on avait besoin de plus d'un champ
	// on aurait du utiliser SQLSelect
}

function ajouterUtilisateur($login,$passe,$couleur="black")
{
	$login = proteger($login); 
	$passe = proteger($passe); 
	$SQL = "insert into users (pseudo, passe, couleur) values ('$login', '$passe', '$couleur')";
	return SQLInsert($SQL);
}

function retirerUtilisateur($idUser){
	$idUser = proteger($idUser);
	$SQL = "delete from users where id='$idUser'";
	return SQLDelete($SQL);
}

function isAdmin($idUser)
{
	// vérifie si l'utilisateur est un administrateur
	$idUser = proteger($idUser); 
	$SQL = "select admin from users where id='$idUser'";
	return SQLGetChamp($SQL);
}

/********* EXERCICE 5 *********/

function listerConversations($mode="tout")
{
	// Liste toutes les conversations ($mode="tout")
	// OU uniquement celles actives  ($mode="actives"), ou inactives  ($mode="inactives")
	$SQL = "select * from conversations";
	switch ($mode){
		case "actives":
			$SQL = "select * from conversations where active=1";
		break;
		case "inactives":
			$SQL = "select * from conversations where active=0";
	}
	return parcoursRs(SQLSelect($SQL));
}

function archiverConversation($idConversation)
{
	// rend une conversation inactive
	$idConversation = proteger($idConversation); 
	$SQL = "update conversations set active=0 where id='$idConversation'";
	SQLUpdate($SQL);
}

function reactiverConversation($idConversation)
{
	// rend une conversation active
	$idConversation = proteger($idConversation); 
	$SQL = "update conversations set active=1 where id='$idConversation'";
	SQLUpdate($SQL);
}

function creerConversation($theme)
{
	$theme = proteger($theme);
	// crée une nouvelle conversation et renvoie son identifiant
	$SQL = "insert into conversations (theme) values ('$theme')";
	SQLInsert($SQL);
}

function supprimerConversation($idConv)
{
	// supprime une conversation et ses messages
	// Utiliser pour cela des mises à jour en cascade en appliquant l'intégrité référentielle
	$SQL_messages = "delete from messages where idConversation='$idConv'";
	SQLDelete($SQL_messages);
	$SQL_conversation = "delete from conversations where id='$idConv'";
	SQLDelete($SQL_conversation);
}


/********* EXERCICE 6 *********/

function enregistrerMessage($idConversation, $idAuteur, $contenu)
{
	// Enregistre un message dans la base en encodant les caractères spéciaux HTML : <, > et & 
	// pour interdire les messages HTML
	$idConversation = proteger($idConversation);
	$idAuteur = proteger($idAuteur);
	$contenu = proteger($contenu);
	$SQL = "insert into messages (idConversation, idAuteur, contenu) values ('$idConversation', '$idAuteur', '$contenu')";
	return SQLInsert($SQL);
	
}
function listerMessages($idConv)
{
	// Liste les messages de cette conversation
	// Champs à extraire : contenu, auteur, couleur 
	// en ne renvoyant pas les utilisateurs blacklistés
	
	$idConv = proteger($idConv);
	$SQL = "select contenu, users.pseudo, users.couleur from conversations join messages on conversations.id=messages.idConversation join users on users.id=messages.idAuteur where idConversation='$idConv' and users.blacklist=0";
	return parcoursRs(SQLSelect($SQL));
}

function listerMessagesFromIndex($idConv,$index)
{
	// Liste les messages de cette conversation, 
	// dont l'id est superieur à l'identifiant passé
	// Champs à extraire : contenu, auteur, couleur 
	// en ne renvoyant pas les utilisateurs blacklistés
	
	$idConv = proteger($idConv);
	$index = proteger($index);
	$SQL = "select contenu, users.pseudo, users.couleur from conversations join messages on conversations.id=messages.idConversation join users on users.id=messages.idAuteur where idConversation='$idConv' and users.blacklist=0 and messages.id>'$index'";
	return parcoursRs(SQLSelect($SQL));

}

function getConversation($idConv)
{	
	// Récupère les données de la conversation (theme, active)
	$SQL = "SELECT theme, active FROM conversations WHERE id='$idConv'";
	$listConversations = parcoursRs(SQLSelect($SQL));

	// Attention : parcoursRS nous renvoie un tableau contenant potentiellement PLUSIEURS CONVERSATIONS
	// Il faut renvoyer uniquement la première case de ce tableau, c'est à dire la case 0 
	// OU false si la conversation n'existe pas
	 
	if (count($listConversations) == 0) return false;
	else return $listConversations;
}

?>