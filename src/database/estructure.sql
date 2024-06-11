DROP DATABASE gastos_mensais_v3;

CREATE DATABASE gastos_mensais_v3;

USE gastos_mensais_v3;

CREATE TABLE `Destinys` (
    `IdDestiny` INT PRIMARY KEY AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,
    `Color` VARCHAR(255),
    `SplitJointExpense` BIT NOT NULL DEFAULT 0
);

CREATE TABLE `CashInflows` (
    `IdCashInflow` INT PRIMARY KEY AUTO_INCREMENT,
    `Description` VARCHAR(255) NOT NULL,
    `Value` FLOAT NOT NULL,
    `EfectiveDate` DATETIME NOT NULL DEFAULT (CURRENT_DATE),
    `IdDestiny` INT NOT NULL,
    FOREIGN KEY (`IdDestiny`) REFERENCES `Destinys`(`IdDestiny`)
);

CREATE TABLE `Banks` (
    `IdBank` INT PRIMARY KEY AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,
    `IconPath` VARCHAR(255)
);

CREATE TABLE `SistemParams` (
    `IdSistemParam` INT PRIMARY KEY AUTO_INCREMENT,
    `Key` VARCHAR(255) NOT NULL,
    `Value` VARCHAR(255) NOT NULL,
    `EfectiveDate` DATE NOT NULL DEFAULT (CURRENT_DATE)
);

CREATE TABLE `ExpenseCategories` (
    `IdExpenseCategory` INT PRIMARY KEY AUTO_INCREMENT,
    Description VARCHAR(255) NOT NULL
);

CREATE TABLE `BaseExpenses` (
    `IdBaseExpense` INT PRIMARY KEY AUTO_INCREMENT,
    `Description` VARCHAR(255) NOT NULL,
    `Price` FLOAT NOT NULL,
    `EntryDate` DATETIME NOT NULL DEFAULT (CURRENT_DATE),
    `IdDestiny` INT NOT NULL,
    `IdBank` INT NOT NULL,
    `IdExpenseCategory` INT NOT NULL,
    `Active` BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (`IdDestiny`) REFERENCES `Destinys`(`IdDestiny`),
    FOREIGN KEY (`IdBank`) REFERENCES `Banks`(`IdBank`),
    FOREIGN KEY (`IdExpenseCategory`) REFERENCES `ExpenseCategories`(`IdExpenseCategory`)
);

CREATE TABLE `DefaultExpenses` (
    `IdDefaultExpense` INT PRIMARY KEY AUTO_INCREMENT,
    `ExpenseDate` DATETIME NOT NULL DEFAULT (CURRENT_DATE),
    `IdBaseExpense` INT NOT NULL UNIQUE,
    FOREIGN KEY (`IdBaseExpense`) REFERENCES `BaseExpenses`(`IdBaseExpense`) ON DELETE CASCADE
);

CREATE TABLE `FixedExpenses` (
    `IdFixedExpense` INT PRIMARY KEY AUTO_INCREMENT,
    `Price` FLOAT,
    `StartDate` DATETIME NOT NULL DEFAULT (CURRENT_DATE),
    `EndDate` DATETIME,
    `IdBaseExpense` INT NOT NULL,
    FOREIGN KEY (`IdBaseExpense`) REFERENCES `BaseExpenses`(`IdBaseExpense`) ON DELETE CASCADE
);

CREATE TABLE `InstallmentExpenses` (
    `IdInstallmentExpense` INT PRIMARY KEY AUTO_INCREMENT,
    `Price` FLOAT,
    `StartDate` DATETIME NOT NULL DEFAULT (CURRENT_DATE),
    `ExpectedDate` DATETIME NOT NULL,
    `CurrentInstallment` INT NOT NULL,
    `MaxInstallment` INT NOT NULL,
    `IdBaseExpense` INT NOT NULL,
    FOREIGN KEY (`IdBaseExpense`) REFERENCES `BaseExpenses`(`IdBaseExpense`) ON DELETE CASCADE
);