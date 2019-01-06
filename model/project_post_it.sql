-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le :  Dim 06 jan. 2019 à 03:12
-- Version du serveur :  10.1.37-MariaDB
-- Version de PHP :  7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `project_post_it`
--

-- --------------------------------------------------------

--
-- Structure de la table `post_it`
--

CREATE TABLE `post_it` (
  `iduser` int(11) NOT NULL,
  `idPostit` int(11) NOT NULL,
  `coordonneesX` int(11) NOT NULL,
  `coordonneesY` int(11) NOT NULL,
  `distance` float NOT NULL,
  `angleX` float NOT NULL,
  `text` varchar(255) NOT NULL,
  `couleur` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `post_it`
--

INSERT INTO `post_it` (`iduser`, `idPostit`, `coordonneesX`, `coordonneesY`, `distance`, `angleX`, `text`, `couleur`) VALUES
(1, 1, 169, 339, 805.378, 2.19623, 'hello world', 'rgb(34,8,170)'),
(1, 3, 461, 663, 527.975, 6.78897, 'hello world II', 'rgb(164,163,133)'),
(1, 4, 1415, 778, 538.22, 24.5958, 'toto', 'rgb(230,202,202)'),
(1, 5, 754, 846, 410.873, 65.3037, 'foo', 'rgb(206,14,128)'),
(1, 6, 1400, 452, 441.681, 14.2739, 'bar', 'rgb(236,72,144)');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `motdepasse` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `prenom`, `email`, `motdepasse`) VALUES
(1, 'utilisateur', 'utilisateur', 'utilisateur@gmail.com', '$2a$10$pz4MnI1/1LkdZon9w2suL.pt/oTgROKaKIXzl6rpTYHQB8Yd20hwa');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
