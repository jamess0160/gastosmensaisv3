CREATE TABLE `Users` (
    `IdUser` INT PRIMARY KEY AUTO_INCREMENT,
    `Name` VARCHAR(255),
    `Login` VARCHAR(255),
    `Password` VARCHAR(255)
);

INSERT INTO
    `Users` (`Name`, `Login`, `Password`)
VALUES
    (
        'Tiago e Luana',
        'tilu',
        '202cb962ac59075b964b07152d234b70'
    );

ALTER TABLE
    `Destinys`
ADD
    `IdUser` int;

ALTER TABLE
    `Destinys`
ADD
    FOREIGN KEY (`IdUser`) REFERENCES `Users`(`IdUser`);

ALTER TABLE
    `CashInflows`
ADD
    `IdUser` int;

ALTER TABLE
    `CashInflows`
ADD
    FOREIGN KEY (`IdUser`) REFERENCES `Users`(`IdUser`);

ALTER TABLE
    `Banks`
ADD
    `IdUser` int;

ALTER TABLE
    `Banks`
ADD
    FOREIGN KEY (`IdUser`) REFERENCES `Users`(`IdUser`);

ALTER TABLE
    `SistemParams`
ADD
    `IdUser` int;

ALTER TABLE
    `SistemParams`
ADD
    FOREIGN KEY (`IdUser`) REFERENCES `Users`(`IdUser`);

ALTER TABLE
    `ExpenseCategories`
ADD
    `IdUser` int;

ALTER TABLE
    `ExpenseCategories`
ADD
    FOREIGN KEY (`IdUser`) REFERENCES `Users`(`IdUser`);

ALTER TABLE
    `BaseExpenses`
ADD
    `IdUser` int;

ALTER TABLE
    `BaseExpenses`
ADD
    FOREIGN KEY (`IdUser`) REFERENCES `Users`(`IdUser`);

UPDATE
    `Destinys`
SET
    IdUser = 1;

UPDATE
    `CashInflows`
SET
    IdUser = 1;

UPDATE
    `Banks`
SET
    IdUser = 1;

UPDATE
    `SistemParams`
SET
    IdUser = 1;

UPDATE
    `ExpenseCategories`
SET
    IdUser = 1;

UPDATE
    `BaseExpenses`
SET
    IdUser = 1;