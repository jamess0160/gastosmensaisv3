CREATE TABLE `nfeexpenses` (
    `IdNfeExpense` INT PRIMARY KEY AUTO_INCREMENT,
    `ExpenseDate` DATETIME NOT NULL DEFAULT (CURRENT_DATE),
    `DanfeCode` varchar(255),
    `Company` varchar(255),
    `IdBaseExpense` INT NOT NULL UNIQUE,
    FOREIGN KEY (`IdBaseExpense`) REFERENCES `baseexpenses`(`IdBaseExpense`) ON DELETE CASCADE
);

CREATE TABLE `nfeitems` (
    `IdNfeItem` INT PRIMARY KEY AUTO_INCREMENT,
    `IdNfeExpense` INT NOT NULL,
    `Description` varchar(255),
    `Quantity` float,
    `UN` varchar(255),
    `UnityValue` float,
    `TotalValue` float,
    FOREIGN KEY (`IdNfeExpense`) REFERENCES `nfeexpenses`(`IdNfeExpense`) ON DELETE CASCADE
);