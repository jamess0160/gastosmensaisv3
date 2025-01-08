CREATE TABLE `nfeitemcategories` (
    `IdNfeItemCategory` INT PRIMARY KEY AUTO_INCREMENT,
    `IdUser` INT NOT NULL,
    Description VARCHAR(255) NOT NULL,
    FOREIGN KEY (`IdUser`) REFERENCES `users`(`IdUser`) ON DELETE CASCADE
);

INSERT INTO
    `nfeitemcategories` (`IdUser`, `Description`)
VALUES
    (1, 'Almoço'),
    (1, 'Janta'),
    (1, 'Café'),
    (1, 'Outros');

ALTER TABLE
    `nfeitems`
ADD
    `IdNfeItemCategory` INT;

UPDATE
    `nfeitems`
SET
    `IdNfeItemCategory` = 1;

ALTER TABLE
    `nfeitems`
ADD
    FOREIGN KEY (`IdNfeItemCategory`) REFERENCES `nfeitemcategories`(`IdNfeItemCategory`) ON DELETE
SET
    NULL;