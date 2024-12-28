CREATE TABLE `expensedestinys` (
    `IdExpenseDestiny` INT PRIMARY KEY AUTO_INCREMENT,
    `IdBaseExpense` INT NOT NULL,
    `IdDestiny` INT NOT NULL,
    FOREIGN KEY (`IdBaseExpense`) REFERENCES `baseexpenses`(`IdBaseExpense`) ON DELETE CASCADE,
    FOREIGN KEY (`IdDestiny`) REFERENCES `destinys`(`IdDestiny`) ON DELETE CASCADE
);

INSERT INTO
    `expensedestinys` (`IdBaseExpense`, `IdDestiny`)
SELECT
    `IdBaseExpense`,
    `IdDestiny`
FROM
    `baseexpenses`
WHERE
    `IdDestiny` IS NOT NULL;

ALTER TABLE
    `baseexpenses` DROP CONSTRAINT `baseexpenses_ibfk_1`;

ALTER TABLE
    `baseexpenses` DROP COLUMN `IdDestiny`;

INSERT INTO
    `expensedestinys` (`IdBaseExpense`, `IdDestiny`)
SELECT
    `IdBaseExpense`,
    1 AS `IdDestiny`
FROM
    `expensedestinys`
WHERE
    `IdDestiny` = 4;

INSERT INTO
    `expensedestinys` (`IdBaseExpense`, `IdDestiny`)
SELECT
    `IdBaseExpense`,
    15 AS `IdDestiny`
FROM
    `expensedestinys`
WHERE
    `IdDestiny` = 4;

DELETE FROM
    `expensedestinys`
WHERE
    `IdDestiny` = 4;