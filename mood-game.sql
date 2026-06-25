-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+deb12u1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : jeu. 25 juin 2026 à 21:02
-- Version du serveur : 10.11.14-MariaDB-0+deb12u2
-- Version de PHP : 8.2.31

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

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `status` enum('pending','accepted') NOT NULL DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `friends`
--

INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `status`, `created_at`) VALUES
(8, 11, 8, 'accepted', '2026-06-25 18:03:56'),
(9, 11, 9, 'accepted', '2026-06-25 18:04:03'),
(10, 11, 10, 'accepted', '2026-06-25 18:04:06'),
(11, 8, 10, 'accepted', '2026-06-25 18:04:23'),
(12, 8, 9, 'accepted', '2026-06-25 18:04:26'),
(13, 10, 9, 'accepted', '2026-06-25 18:04:37');

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `groups`
--

INSERT INTO `groups` (`id`, `name`, `created_at`) VALUES
(7, 'twe-projet', '2026-06-25 18:05:04'),
(8, 'Foot', '2026-06-25 18:40:28');

-- --------------------------------------------------------

--
-- Structure de la table `group_members`
--

CREATE TABLE `group_members` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `joined_at` datetime DEFAULT current_timestamp(),
  `points` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `group_members`
--

INSERT INTO `group_members` (`id`, `user_id`, `group_id`, `joined_at`, `points`) VALUES
(15, 9, 7, '2026-06-25 18:05:04', 5),
(16, 11, 7, '2026-06-25 18:05:04', 3),
(17, 8, 7, '2026-06-25 18:05:04', 9),
(18, 10, 7, '2026-06-25 18:05:04', 5),
(19, 8, 8, '2026-06-25 18:40:28', 9),
(20, 9, 8, '2026-06-25 18:40:28', 5),
(21, 10, 8, '2026-06-25 18:40:28', 5);

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `group_id`, `user_id`, `content`, `created_at`) VALUES
(21, 7, 9, 'Ça bosse ?', '2026-06-25 18:05:17'),
(23, 7, 8, 'Je sais pas coder....', '2026-06-25 18:06:02'),
(24, 7, 10, 'foot ce soir ?', '2026-06-25 18:06:15'),
(25, 7, 8, 'En vrai flemme hein', '2026-06-25 18:06:29'),
(26, 7, 11, 'Faut bosser, donc non', '2026-06-25 18:06:45'),
(27, 8, 8, 'Ce soir foot ?', '2026-06-25 18:40:35'),
(28, 8, 10, 'En vrai je suis deter vazy !', '2026-06-25 18:41:04'),
(30, 8, 8, 't\\\'es où ?', '2026-06-25 20:41:26');

-- --------------------------------------------------------

--
-- Structure de la table `paris`
--

CREATE TABLE `paris` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_user_id` int(11) NOT NULL,
  `emotion` varchar(255) NOT NULL,
  `date_pari` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `paris`
--

INSERT INTO `paris` (`id`, `user_id`, `friend_user_id`, `emotion`, `date_pari`) VALUES
(160, 8, 9, 'stressé', '2026-06-05'),
(161, 8, 10, 'triste', '2026-06-05'),
(162, 8, 11, 'fatigué', '2026-06-05'),
(163, 8, 9, 'fatigué', '2026-06-06'),
(164, 8, 10, 'colère', '2026-06-06'),
(165, 8, 11, 'triste', '2026-06-06'),
(166, 8, 9, 'stressé', '2026-06-07'),
(167, 8, 10, 'fatigué', '2026-06-07'),
(168, 8, 11, 'colère', '2026-06-07'),
(169, 8, 9, 'stressé', '2026-06-08'),
(170, 8, 10, 'triste', '2026-06-08'),
(171, 8, 11, 'fatigué', '2026-06-08'),
(172, 9, 8, 'heureux', '2026-06-05'),
(173, 9, 10, 'fatigué', '2026-06-05'),
(174, 9, 11, 'triste', '2026-06-05'),
(175, 9, 8, 'stressé', '2026-06-06'),
(176, 9, 10, 'colère', '2026-06-06'),
(177, 9, 11, 'fatigué', '2026-06-06'),
(178, 9, 8, 'heureux', '2026-06-07'),
(179, 9, 10, 'fatigué', '2026-06-07'),
(180, 9, 11, 'triste', '2026-06-07'),
(181, 10, 8, 'heureux', '2026-06-05'),
(182, 10, 9, 'heureux', '2026-06-05'),
(183, 10, 11, 'fatigué', '2026-06-05'),
(184, 10, 8, 'stressé', '2026-06-06'),
(185, 10, 9, 'fatigué', '2026-06-06'),
(186, 10, 11, 'colère', '2026-06-06'),
(187, 10, 8, 'colère', '2026-06-07'),
(188, 10, 9, 'stressé', '2026-06-07'),
(189, 10, 11, 'triste', '2026-06-07'),
(190, 11, 8, 'heureux', '2026-06-05'),
(191, 11, 9, 'stressé', '2026-06-05'),
(192, 11, 10, 'triste', '2026-06-05'),
(193, 11, 8, 'fatigué', '2026-06-06'),
(194, 11, 9, 'heureux', '2026-06-06'),
(195, 11, 10, 'stressé', '2026-06-06'),
(196, 11, 8, 'colère', '2026-06-07'),
(197, 11, 9, 'fatigué', '2026-06-07'),
(198, 11, 10, 'heureux', '2026-06-07');

-- --------------------------------------------------------

--
-- Structure de la table `planning_events`
--

CREATE TABLE `planning_events` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_event` date NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `planning_events`
--

INSERT INTO `planning_events` (`id`, `user_id`, `date_event`, `titre`, `description`, `heure_debut`, `heure_fin`, `created_at`) VALUES
(67, 8, '2026-06-26', 'Présentations\n', 'TWE\n', '08:00:00', '12:00:00', '2026-06-25 18:07:31'),
(69, 8, '2026-06-26', 'Salle de sport\n', 'Séance\n', '18:00:00', '20:00:00', '2026-06-25 18:08:12'),
(70, 8, '2026-06-25', 'Préparer prez\n', 'Travailler dur\n', '00:00:00', '23:30:00', '2026-06-25 18:09:14'),
(71, 8, '2026-06-17', 'Rien\n', 'Rien à faire\n', '18:00:00', '19:00:00', '2026-06-25 18:09:46'),
(72, 8, '2026-06-18', 'Cours\n', 'IAE\n', '08:00:00', '20:00:00', '2026-06-25 18:10:02'),
(73, 8, '2026-06-24', 'Préparer repas\n', 'Regarder frigo\n', '12:00:00', '12:30:00', '2026-06-25 18:27:51'),
(74, 8, '2026-06-23', 'Cours\n', 'Description', '11:30:00', '15:30:00', '2026-06-25 18:28:45'),
(76, 8, '2026-06-23', 'Fête\n', 'Description', '04:00:00', '08:30:00', '2026-06-25 18:28:46'),
(77, 8, '2026-06-22', 'Foot\n', 'Description', '01:00:00', '02:30:00', '2026-06-25 18:28:46'),
(78, 8, '2026-06-27', 'Cours', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:47'),
(79, 8, '2026-06-30', 'Garage', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:54'),
(80, 8, '2026-06-30', 'Dentiste', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:54'),
(81, 8, '2026-06-29', 'Match', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:56'),
(82, 8, '2026-07-02', 'Foot', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:57'),
(83, 8, '2026-07-02', 'Match', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:57'),
(84, 8, '2026-07-02', 'Travail', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:57'),
(85, 8, '2026-07-01', 'Voyage', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:57'),
(86, 8, '2026-07-03', 'Bowling', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:58'),
(87, 8, '2026-07-03', 'Patinoire', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:58'),
(88, 8, '2026-07-04', 'Cinéma', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:28:59'),
(89, 8, '2026-06-25', 'Voyage', 'Description', '16:00:00', '17:00:00', '2026-06-25 18:29:01'),
(90, 8, '2026-06-19', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:09'),
(91, 8, '2026-06-19', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:09'),
(92, 8, '2026-06-16', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:10'),
(93, 8, '2026-06-15', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:10'),
(94, 8, '2026-06-15', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:10'),
(95, 8, '2026-06-15', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:11'),
(96, 8, '2026-06-20', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:11'),
(97, 8, '2026-06-21', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:12'),
(98, 8, '2026-06-21', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:12'),
(99, 8, '2026-06-17', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:13'),
(100, 10, '2026-06-22', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:32'),
(101, 10, '2026-06-22', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:32'),
(102, 10, '2026-06-22', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:33'),
(103, 10, '2026-06-23', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:33'),
(104, 10, '2026-06-23', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:34'),
(108, 10, '2026-06-28', 'Cours', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:38'),
(109, 10, '2026-06-28', 'Piscine', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:40'),
(110, 10, '2026-06-28', 'Envoyer mail', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:42'),
(116, 10, '2026-06-24', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:51'),
(117, 10, '2026-06-24', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:51'),
(118, 10, '2026-06-24', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:29:52'),
(119, 10, '2026-06-15', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:30:51'),
(120, 10, '2026-06-15', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:30:51'),
(121, 10, '2026-06-15', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:30:51'),
(122, 10, '2026-06-16', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:30:52'),
(123, 10, '2026-06-17', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:30:52'),
(124, 10, '2026-06-17', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:30:52'),
(125, 10, '2026-06-17', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:30:52'),
(126, 10, '2026-06-21', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:30:54'),
(127, 10, '2026-06-21', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:30:58'),
(128, 10, '2026-06-29', 'Shotgun', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:02'),
(129, 10, '2026-06-29', 'Piscine', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:02'),
(130, 10, '2026-06-30', 'RDV Banque', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:02'),
(131, 10, '2026-06-30', 'RDV Mairie', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:03'),
(132, 10, '2026-07-01', 'Finale LDC', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:03'),
(133, 10, '2026-07-01', 'Tennis', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:03'),
(134, 10, '2026-07-01', 'Révision', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:03'),
(135, 9, '2026-06-22', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:17'),
(136, 9, '2026-06-22', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:18'),
(137, 9, '2026-06-22', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:18'),
(138, 9, '2026-06-23', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:18'),
(139, 9, '2026-06-24', 'Titre', 'Petite description\n', '00:00:00', '00:00:00', '2026-06-25 18:31:19'),
(140, 9, '2026-06-25', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:19'),
(141, 9, '2026-06-26', 'Courir', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:20'),
(142, 9, '2026-06-28', 'Natation', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:20'),
(143, 9, '2026-06-27', 'Réunion', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:21'),
(144, 9, '2026-06-29', 'Cours', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:22'),
(145, 9, '2026-06-29', 'Salle de sport', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:22'),
(146, 9, '2026-06-29', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:23'),
(147, 9, '2026-06-30', 'Entraînement', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:23'),
(148, 9, '2026-07-02', 'Mariage', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:23'),
(149, 9, '2026-07-01', 'Voyage', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:24'),
(150, 9, '2026-07-03', 'Réunion', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:24'),
(151, 9, '2026-07-04', 'Piscine', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:25'),
(152, 9, '2026-07-05', 'Nettoyage', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:25'),
(153, 9, '2026-06-15', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:27'),
(154, 9, '2026-06-15', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:27'),
(155, 9, '2026-06-15', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:27'),
(156, 9, '2026-06-16', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:28'),
(157, 9, '2026-06-17', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:28'),
(158, 9, '2026-06-19', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:28'),
(159, 9, '2026-06-18', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:29'),
(160, 9, '2026-06-20', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:29'),
(161, 9, '2026-06-21', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:29'),
(162, 9, '2026-06-30', 'Réparation', 'Voiture', '00:00:00', '00:00:00', '2026-06-25 18:31:32'),
(163, 9, '2026-06-23', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:33'),
(164, 9, '2026-06-23', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:33'),
(165, 11, '2026-06-22', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:45'),
(166, 11, '2026-06-23', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:46'),
(167, 11, '2026-06-23', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:46'),
(168, 11, '2026-06-23', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:46'),
(169, 11, '2026-06-24', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:47'),
(170, 11, '2026-06-24', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:47'),
(171, 11, '2026-06-25', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:48'),
(172, 11, '2026-06-25', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:48'),
(173, 11, '2026-06-25', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:48'),
(174, 11, '2026-07-02', 'Fête', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:51'),
(175, 11, '2026-07-02', 'Anniversaire', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:51'),
(176, 11, '2026-07-02', 'Annonce', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:51'),
(177, 11, '2026-07-03', 'Foot', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:52'),
(178, 11, '2026-07-03', 'Dentiste', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:52'),
(179, 11, '2026-07-03', 'Musique', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:52'),
(180, 11, '2026-07-04', 'Escalade', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:52'),
(181, 11, '2026-07-04', 'Entraînement', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:52'),
(182, 11, '2026-07-05', 'Cours', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:53'),
(183, 11, '2026-06-17', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:55'),
(184, 11, '2026-06-17', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:55'),
(185, 11, '2026-06-17', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:55'),
(186, 11, '2026-06-18', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:55'),
(187, 11, '2026-06-18', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:56'),
(188, 11, '2026-06-18', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:56'),
(189, 11, '2026-06-19', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:56'),
(190, 11, '2026-06-19', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:56'),
(191, 11, '2026-06-19', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 18:31:56'),
(201, 8, '2026-06-23', 'Titre', 'Description', '00:00:00', '00:00:00', '2026-06-25 21:31:29');

-- --------------------------------------------------------

--
-- Structure de la table `real_emotions`
--

CREATE TABLE `real_emotions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `emotion` varchar(50) NOT NULL,
  `date_emotion` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `real_emotions`
--

INSERT INTO `real_emotions` (`id`, `user_id`, `emotion`, `date_emotion`) VALUES
(145, 8, 'heureux', '2026-06-05'),
(146, 9, 'stressé', '2026-06-05'),
(147, 10, 'triste', '2026-06-05'),
(148, 11, 'fatigué', '2026-06-05'),
(149, 8, 'stressé', '2026-06-06'),
(150, 9, 'fatigué', '2026-06-06'),
(151, 10, 'colère', '2026-06-06'),
(152, 11, 'triste', '2026-06-06'),
(153, 8, 'heureux', '2026-06-07'),
(154, 9, 'stressé', '2026-06-07'),
(155, 10, 'fatigué', '2026-06-07'),
(156, 11, 'colère', '2026-06-07'),
(157, 8, 'colère', '2026-06-08'),
(158, 9, 'fatigué', '2026-06-08'),
(159, 10, 'stressé', '2026-06-08'),
(160, 11, 'triste', '2026-06-08'),
(161, 8, 'heureux', '2026-06-09'),
(162, 9, 'stressé', '2026-06-09'),
(163, 10, 'fatigué', '2026-06-09'),
(164, 11, 'colère', '2026-06-09'),
(165, 8, 'stressé', '2026-06-10'),
(166, 9, 'triste', '2026-06-10'),
(167, 10, 'fatigué', '2026-06-10'),
(168, 11, 'heureux', '2026-06-10'),
(169, 8, 'heureux', '2026-06-11'),
(170, 9, 'stressé', '2026-06-11'),
(171, 10, 'triste', '2026-06-11'),
(172, 11, 'fatigué', '2026-06-11'),
(173, 8, 'stressé', '2026-06-12'),
(174, 9, 'fatigué', '2026-06-12'),
(175, 10, 'colère', '2026-06-12'),
(176, 11, 'triste', '2026-06-12'),
(177, 8, 'heureux', '2026-06-13'),
(178, 9, 'stressé', '2026-06-13'),
(179, 10, 'fatigué', '2026-06-13'),
(180, 11, 'colère', '2026-06-13'),
(181, 8, 'colère', '2026-06-14'),
(182, 9, 'fatigué', '2026-06-14'),
(183, 10, 'stressé', '2026-06-14'),
(184, 11, 'triste', '2026-06-14'),
(185, 8, 'heureux', '2026-06-15'),
(186, 9, 'stressé', '2026-06-15'),
(187, 10, 'fatigué', '2026-06-15'),
(188, 11, 'colère', '2026-06-15'),
(189, 8, 'stressé', '2026-06-16'),
(190, 9, 'fatigué', '2026-06-16'),
(191, 10, 'triste', '2026-06-16'),
(192, 11, 'heureux', '2026-06-16'),
(193, 8, 'heureux', '2026-06-17'),
(194, 9, 'stressé', '2026-06-17'),
(195, 10, 'fatigué', '2026-06-17'),
(196, 11, 'colère', '2026-06-17'),
(197, 8, 'colère', '2026-06-18'),
(198, 9, 'fatigué', '2026-06-18'),
(199, 10, 'stressé', '2026-06-18'),
(200, 11, 'triste', '2026-06-18'),
(201, 8, 'heureux', '2026-06-19'),
(202, 9, 'stressé', '2026-06-19'),
(203, 10, 'triste', '2026-06-19'),
(204, 11, 'fatigué', '2026-06-19'),
(205, 8, 'stressé', '2026-06-20'),
(206, 9, 'fatigué', '2026-06-20'),
(207, 10, 'colère', '2026-06-20'),
(208, 11, 'triste', '2026-06-20'),
(209, 8, 'heureux', '2026-06-21'),
(210, 9, 'stressé', '2026-06-21'),
(211, 10, 'fatigué', '2026-06-21'),
(212, 11, 'colère', '2026-06-21'),
(213, 8, 'colère', '2026-06-22'),
(214, 9, 'fatigué', '2026-06-22'),
(215, 10, 'stressé', '2026-06-22'),
(216, 11, 'triste', '2026-06-22'),
(217, 8, 'heureux', '2026-06-23'),
(218, 9, 'stressé', '2026-06-23'),
(219, 10, 'fatigué', '2026-06-23'),
(220, 11, 'colère', '2026-06-23'),
(221, 8, 'stressé', '2026-06-24'),
(222, 9, 'triste', '2026-06-24'),
(223, 10, 'fatigué', '2026-06-24'),
(224, 11, 'heureux', '2026-06-24'),
(225, 8, 'heureux', '2026-06-25'),
(227, 10, 'triste', '2026-06-25'),
(228, 11, 'fatigué', '2026-06-25');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `created_at`) VALUES
(8, 'Axel', 'PARIS', 'Lix4rex', 'test', '2026-06-25 18:01:43'),
(9, 'Carl', 'Bouteiller', 'carlos', 'test', '2026-06-25 18:03:01'),
(10, 'Ismail', 'Jouad', 'isma', 'test', '2026-06-25 18:03:14'),
(11, 'Martin', 'Hebraud', 'martin', 'test', '2026-06-25 18:03:41');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`friend_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Index pour la table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`group_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Index pour la table `paris`
--
ALTER TABLE `paris`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `friend_user_id` (`friend_user_id`);

--
-- Index pour la table `planning_events`
--
ALTER TABLE `planning_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `real_emotions`
--
ALTER TABLE `real_emotions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `group_members`
--
ALTER TABLE `group_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `paris`
--
ALTER TABLE `paris`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=199;

--
-- AUTO_INCREMENT pour la table `planning_events`
--
ALTER TABLE `planning_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT pour la table `real_emotions`
--
ALTER TABLE `real_emotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=230;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
-- Contraintes pour la table `planning_events`
--
ALTER TABLE `planning_events`
  ADD CONSTRAINT `planning_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `real_emotions`
--
ALTER TABLE `real_emotions`
  ADD CONSTRAINT `real_emotions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
