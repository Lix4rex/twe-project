-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 24 juin 2026 à 11:50
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mood-game`
--

-- --------------------------------------------------------

--
-- Structure de la table `friends`
--

DROP TABLE IF EXISTS `friends`;
CREATE TABLE IF NOT EXISTS `friends` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `friend_id` int NOT NULL,
  `status` enum('pending','accepted') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`friend_id`),
  KEY `friend_id` (`friend_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `friends`
--

INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `status`, `created_at`) VALUES
(2, 2, 4, 'accepted', '2026-06-21 16:17:50'),
(3, 2, 3, 'accepted', '2026-06-21 16:47:21'),
(4, 6, 2, 'pending', '2026-06-24 13:49:15');

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

DROP TABLE IF EXISTS `groups`;
CREATE TABLE IF NOT EXISTS `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `groups`
--

INSERT INTO `groups` (`id`, `name`, `created_at`) VALUES
(1, 'FOOTBALL', '2026-06-15 13:09:13'),
(2, 'RUGBY', '2026-06-15 13:16:50'),
(3, 'ugfghzv', '2026-06-21 16:31:08'),
(4, 'vgvjghvhgv', '2026-06-21 16:48:13');

-- --------------------------------------------------------

--
-- Structure de la table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
CREATE TABLE IF NOT EXISTS `group_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`group_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `group_members`
--

INSERT INTO `group_members` (`id`, `user_id`, `group_id`, `joined_at`) VALUES
(1, 1, 1, '2026-06-15 13:10:00'),
(2, 2, 1, '2026-06-15 13:10:00'),
(3, 3, 1, '2026-06-15 13:10:00'),
(4, 2, 3, '2026-06-21 16:31:08'),
(5, 3, 3, '2026-06-21 16:31:08'),
(6, 4, 3, '2026-06-21 16:31:09'),
(7, 3, 4, '2026-06-21 16:48:13'),
(8, 2, 4, '2026-06-21 16:48:13');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `group_id`, `user_id`, `content`, `created_at`) VALUES
(1, 1, 1, 'Salut tout le monde 👋', '2026-06-15 13:11:31'),
(2, 1, 2, 'Hey ! Ça va ?', '2026-06-15 13:11:31'),
(3, 1, 3, 'On sort ce soir ?', '2026-06-15 13:11:31'),
(15, 1, 2, 'je suis le goat', '2026-06-16 13:49:25'),
(16, 1, 2, 'bonjour !!!!', '2026-06-17 01:19:33'),
(17, 1, 1, 'FRANCE 3 - SENEGAL 1 !!!!', '2026-06-17 13:01:35'),
(18, 3, 2, 'hello\n', '2026-06-21 16:31:14'),
(19, 4, 3, 'hcyyrftcfcghjc', '2026-06-21 16:48:24');

-- --------------------------------------------------------

--
-- Structure de la table `paris`
--

DROP TABLE IF EXISTS `paris`;
CREATE TABLE IF NOT EXISTS `paris` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `friend_user_id` int NOT NULL,
  `emotion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date_pari` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `friend_user_id` (`friend_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `paris`
--

INSERT INTO `paris` (`id`, `user_id`, `friend_user_id`, `emotion`, `date_pari`) VALUES
(26, 2, 2, 'fatigué', '2026-06-16'),
(27, 1, 2, 'colère', '2026-06-17'),
(28, 1, 3, 'triste', '2026-06-17'),
(29, 1, 1, 'stressé', '2026-06-17'),
(30, 2, 3, 'colère', '2026-06-17'),
(31, 2, 1, 'fatigué', '2026-06-18');

-- --------------------------------------------------------

--
-- Structure de la table `real_emotions`
--

DROP TABLE IF EXISTS `real_emotions`;
CREATE TABLE IF NOT EXISTS `real_emotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `emotion` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `date_emotion` date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `real_emotions`
--

INSERT INTO `real_emotions` (`id`, `user_id`, `emotion`, `date_emotion`) VALUES
(3, 2, 'fatigué', '2026-06-16'),
(4, 1, 'triste', '2026-06-16'),
(5, 1, 'triste', '2026-06-15'),
(6, 1, 'triste', '2026-06-14'),
(7, 1, 'triste', '2026-06-13'),
(8, 1, 'triste', '2026-06-12'),
(9, 1, 'fatigué', '2026-06-11'),
(10, 1, 'triste', '2026-06-10'),
(11, 1, 'triste', '2026-06-09'),
(12, 1, 'triste', '2026-06-08'),
(13, 2, 'heureux', '2026-06-21');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `created_at`) VALUES
(1, 'Axel', 'PARIS', 'Lix4rex', 'test', '2026-06-15 13:08:26'),
(2, 'Lionel', 'Messi', 'GOAT', 'test', '2026-06-15 13:08:26'),
(3, 'Khvicha', 'Kvaratskhelia', 'Kvara', 'test', '2026-06-15 13:08:26'),
(4, 'John', 'Doe', 'johndoe', 'test', '2026-06-15 13:10:35'),
(5, 'ismail', 'jpuad', 'ISMAITHEGOAT', 'test', '2026-06-24 12:14:38'),
(6, 'odijnazoi', 'iudhziu', 'axellegoaaattt', 'test', '2026-06-24 13:39:48');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`);

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`);

--
-- Contraintes pour la table `paris`
--
ALTER TABLE `paris`
  ADD CONSTRAINT `paris_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `paris_ibfk_2` FOREIGN KEY (`friend_user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `real_emotions`
--
ALTER TABLE `real_emotions`
  ADD CONSTRAINT `real_emotions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
