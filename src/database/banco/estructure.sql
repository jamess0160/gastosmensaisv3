-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: 192.168.100.10    Database: gastos_mensais_v3
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banks`
--

DROP TABLE IF EXISTS `banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banks` (
  `IdBank` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `IconPath` varchar(255) DEFAULT NULL,
  `IdUser` int DEFAULT NULL,
  `Color` varchar(255) DEFAULT NULL,
  `Position` int DEFAULT NULL,
  PRIMARY KEY (`IdBank`),
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `banks_ibfk_1` FOREIGN KEY (`IdUser`) REFERENCES `users` (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `baseexpenses`
--

DROP TABLE IF EXISTS `baseexpenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baseexpenses` (
  `IdBaseExpense` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) NOT NULL,
  `Price` float NOT NULL,
  `EntryDate` datetime NOT NULL DEFAULT (curdate()),
  `IdBank` int DEFAULT NULL,
  `IdExpenseCategory` int DEFAULT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT '1',
  `IdUser` int DEFAULT NULL,
  PRIMARY KEY (`IdBaseExpense`),
  KEY `IdBank` (`IdBank`),
  KEY `IdExpenseCategory` (`IdExpenseCategory`),
  KEY `baseexpenses_ibfk_4` (`IdUser`),
  CONSTRAINT `baseexpenses_ibfk_2` FOREIGN KEY (`IdBank`) REFERENCES `banks` (`IdBank`) ON DELETE SET NULL,
  CONSTRAINT `baseexpenses_ibfk_3` FOREIGN KEY (`IdExpenseCategory`) REFERENCES `expensecategories` (`IdExpenseCategory`) ON DELETE SET NULL,
  CONSTRAINT `baseexpenses_ibfk_4` FOREIGN KEY (`IdUser`) REFERENCES `users` (`IdUser`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=587 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cashinflowdestinys`
--

DROP TABLE IF EXISTS `cashinflowdestinys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cashinflowdestinys` (
  `IdExpenseDestiny` int NOT NULL AUTO_INCREMENT,
  `IdCashInflow` int NOT NULL,
  `IdDestiny` int NOT NULL,
  PRIMARY KEY (`IdExpenseDestiny`),
  KEY `IdCashInflow` (`IdCashInflow`),
  KEY `IdDestiny` (`IdDestiny`),
  CONSTRAINT `cashinflowdestinys_ibfk_1` FOREIGN KEY (`IdCashInflow`) REFERENCES `cashinflows` (`IdCashInflow`) ON DELETE CASCADE,
  CONSTRAINT `cashinflowdestinys_ibfk_2` FOREIGN KEY (`IdDestiny`) REFERENCES `destinys` (`IdDestiny`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cashinflows`
--

DROP TABLE IF EXISTS `cashinflows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cashinflows` (
  `IdCashInflow` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) NOT NULL,
  `Value` float NOT NULL,
  `EfectiveDate` datetime NOT NULL DEFAULT (curdate()),
  `IdUser` int DEFAULT NULL,
  PRIMARY KEY (`IdCashInflow`),
  KEY `cashinflows_ibfk_2` (`IdUser`),
  CONSTRAINT `cashinflows_ibfk_2` FOREIGN KEY (`IdUser`) REFERENCES `users` (`IdUser`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `defaultexpenses`
--

DROP TABLE IF EXISTS `defaultexpenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `defaultexpenses` (
  `IdDefaultExpense` int NOT NULL AUTO_INCREMENT,
  `ExpenseDate` datetime NOT NULL DEFAULT (curdate()),
  `IdBaseExpense` int NOT NULL,
  PRIMARY KEY (`IdDefaultExpense`),
  UNIQUE KEY `IdBaseExpense` (`IdBaseExpense`),
  CONSTRAINT `defaultexpenses_ibfk_1` FOREIGN KEY (`IdBaseExpense`) REFERENCES `baseexpenses` (`IdBaseExpense`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=508 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `destinys`
--

DROP TABLE IF EXISTS `destinys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinys` (
  `IdDestiny` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Color` varchar(255) DEFAULT NULL,
  `SplitJointExpense` bit(1) NOT NULL DEFAULT b'0',
  `IdUser` int DEFAULT NULL,
  `Position` int DEFAULT NULL,
  PRIMARY KEY (`IdDestiny`),
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `destinys_ibfk_1` FOREIGN KEY (`IdUser`) REFERENCES `users` (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `expensecategories`
--

DROP TABLE IF EXISTS `expensecategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expensecategories` (
  `IdExpenseCategory` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) NOT NULL,
  `IdUser` int DEFAULT NULL,
  `Position` int DEFAULT NULL,
  PRIMARY KEY (`IdExpenseCategory`),
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `expensecategories_ibfk_1` FOREIGN KEY (`IdUser`) REFERENCES `users` (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `expensedestinys`
--

DROP TABLE IF EXISTS `expensedestinys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expensedestinys` (
  `IdExpenseDestiny` int NOT NULL AUTO_INCREMENT,
  `IdBaseExpense` int NOT NULL,
  `IdDestiny` int NOT NULL,
  PRIMARY KEY (`IdExpenseDestiny`),
  KEY `IdBaseExpense` (`IdBaseExpense`),
  KEY `IdDestiny` (`IdDestiny`),
  CONSTRAINT `expensedestinys_ibfk_1` FOREIGN KEY (`IdBaseExpense`) REFERENCES `baseexpenses` (`IdBaseExpense`) ON DELETE CASCADE,
  CONSTRAINT `expensedestinys_ibfk_2` FOREIGN KEY (`IdDestiny`) REFERENCES `destinys` (`IdDestiny`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=729 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fixedexpenses`
--

DROP TABLE IF EXISTS `fixedexpenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fixedexpenses` (
  `IdFixedExpense` int NOT NULL AUTO_INCREMENT,
  `Price` float DEFAULT NULL,
  `StartDate` datetime NOT NULL DEFAULT (curdate()),
  `EndDate` datetime DEFAULT NULL,
  `IdBaseExpense` int NOT NULL,
  PRIMARY KEY (`IdFixedExpense`),
  KEY `IdBaseExpense` (`IdBaseExpense`),
  CONSTRAINT `fixedexpenses_ibfk_1` FOREIGN KEY (`IdBaseExpense`) REFERENCES `baseexpenses` (`IdBaseExpense`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `installmentexpenses`
--

DROP TABLE IF EXISTS `installmentexpenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installmentexpenses` (
  `IdInstallmentExpense` int NOT NULL AUTO_INCREMENT,
  `Price` float DEFAULT NULL,
  `StartDate` datetime NOT NULL DEFAULT (curdate()),
  `ExpectedDate` datetime NOT NULL,
  `CurrentInstallment` int NOT NULL,
  `MaxInstallment` int NOT NULL,
  `IdBaseExpense` int NOT NULL,
  PRIMARY KEY (`IdInstallmentExpense`),
  KEY `IdBaseExpense` (`IdBaseExpense`),
  CONSTRAINT `installmentexpenses_ibfk_1` FOREIGN KEY (`IdBaseExpense`) REFERENCES `baseexpenses` (`IdBaseExpense`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nfeexpenses`
--

DROP TABLE IF EXISTS `nfeexpenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nfeexpenses` (
  `IdNfeExpense` int NOT NULL AUTO_INCREMENT,
  `ExpenseDate` datetime NOT NULL DEFAULT (curdate()),
  `DanfeCode` varchar(255) DEFAULT NULL,
  `Company` varchar(255) DEFAULT NULL,
  `IdBaseExpense` int NOT NULL,
  PRIMARY KEY (`IdNfeExpense`),
  UNIQUE KEY `IdBaseExpense` (`IdBaseExpense`),
  CONSTRAINT `nfeexpenses_ibfk_1` FOREIGN KEY (`IdBaseExpense`) REFERENCES `baseexpenses` (`IdBaseExpense`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nfeitemcategories`
--

DROP TABLE IF EXISTS `nfeitemcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nfeitemcategories` (
  `IdNfeItemCategory` int NOT NULL AUTO_INCREMENT,
  `IdUser` int NOT NULL,
  `Description` varchar(255) NOT NULL,
  PRIMARY KEY (`IdNfeItemCategory`),
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `nfeitemcategories_ibfk_1` FOREIGN KEY (`IdUser`) REFERENCES `users` (`IdUser`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nfeitems`
--

DROP TABLE IF EXISTS `nfeitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nfeitems` (
  `IdNfeItem` int NOT NULL AUTO_INCREMENT,
  `IdNfeExpense` int NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Quantity` float DEFAULT NULL,
  `UN` varchar(255) DEFAULT NULL,
  `UnityValue` float DEFAULT NULL,
  `TotalValue` float DEFAULT NULL,
  `IdNfeItemCategory` int DEFAULT NULL,
  PRIMARY KEY (`IdNfeItem`),
  KEY `IdNfeExpense` (`IdNfeExpense`),
  KEY `IdNfeItemCategory` (`IdNfeItemCategory`),
  CONSTRAINT `nfeitems_ibfk_1` FOREIGN KEY (`IdNfeExpense`) REFERENCES `nfeexpenses` (`IdNfeExpense`) ON DELETE CASCADE,
  CONSTRAINT `nfeitems_ibfk_2` FOREIGN KEY (`IdNfeItemCategory`) REFERENCES `nfeitemcategories` (`IdNfeItemCategory`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sistemparams`
--

DROP TABLE IF EXISTS `sistemparams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sistemparams` (
  `IdSistemParam` int NOT NULL AUTO_INCREMENT,
  `Key` varchar(255) NOT NULL,
  `Value` varchar(255) NOT NULL,
  `EfectiveDate` date NOT NULL DEFAULT (curdate()),
  `IdUser` int DEFAULT NULL,
  PRIMARY KEY (`IdSistemParam`),
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `sistemparams_ibfk_1` FOREIGN KEY (`IdUser`) REFERENCES `users` (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `IdUser` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Login` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `UseAuth` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usersauth`
--

DROP TABLE IF EXISTS `usersauth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersauth` (
  `IdUserAuth` int NOT NULL AUTO_INCREMENT,
  `IdUser` int NOT NULL,
  `Token` text NOT NULL,
  `PublicKey` blob NOT NULL,
  `Counter` bigint NOT NULL,
  `DeviceKey` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdUserAuth`),
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `usersauth_ibfk_1` FOREIGN KEY (`IdUser`) REFERENCES `users` (`IdUser`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-12 13:14:12
