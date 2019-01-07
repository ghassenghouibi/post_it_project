-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le :  lun. 07 jan. 2019 à 20:45
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
(1, 1, 577, 312, 422.553, 10.7052, 'un premier post-it', 'rgb(157,158,29)'),
(1, 2, 1226, 223, 377.243, 40.6439, 'un deuxième', 'rgb(197,179,102)'),
(1, 3, 35, 461, 925.47, 6.60303, 'un troisème', 'rgb(74,74,223)');

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
(1, 'user', 'user', 'user@gmail.com', '$2a$10$TuDddJly/eZsYyt8soNoQeXYemLrCk6.N5B4dG4a8R5oxBlfumu32');

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
