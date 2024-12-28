CREATE TABLE `cashinflowdestinys` (
    `IdExpenseDestiny` INT PRIMARY KEY AUTO_INCREMENT,
    `IdCashInflow` INT NOT NULL,
    `IdDestiny` INT NOT NULL,
    FOREIGN KEY (`IdCashInflow`) REFERENCES `cashinflows`(`IdCashInflow`) ON DELETE CASCADE,
    FOREIGN KEY (`IdDestiny`) REFERENCES `destinys`(`IdDestiny`) ON DELETE CASCADE
);

INSERT INTO
    `cashinflowdestinys` (`IdCashInflow`, `IdDestiny`)
SELECT
    `IdCashInflow`,
    `IdDestiny`
FROM
    `cashinflows`
WHERE
    `IdDestiny` IS NOT NULL;

ALTER TABLE
    `cashinflows` DROP CONSTRAINT `cashinflows_ibfk_1`;

ALTER TABLE
    `cashinflows` DROP COLUMN `IdDestiny`;