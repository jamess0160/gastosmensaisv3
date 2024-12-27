CREATE TABLE `ExpenseDestinys` (
    `IdExpenseDestiny` INT PRIMARY KEY AUTO_INCREMENT,
    `IdBaseExpense` INT NOT NULL,
    `IdDestiny` INT NOT NULL,
    FOREIGN KEY (`IdBaseExpense`) REFERENCES `BaseExpenses`(`IdBaseExpense`) ON DELETE CASCADE,
    FOREIGN KEY (`IdDestiny`) REFERENCES `Destinys`(`IdDestiny`) ON DELETE CASCADE
);

INSERT INTO
    `ExpenseDestinys` (`IdBaseExpense`, `IdDestiny`)
SELECT
    `IdBaseExpense`,
    `IdDestiny`
FROM
    BaseExpenses
WHERE
    IdDestiny IS NOT NULL;

ALTER TABLE
    `BaseExpenses` DROP CONSTRAINT `baseexpenses_ibfk_1`;

ALTER TABLE
    `BaseExpenses` DROP COLUMN `IdDestiny`;