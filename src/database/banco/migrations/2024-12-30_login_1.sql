CREATE TABLE `usersauth`(
    `IdUserAuth` INT PRIMARY KEY AUTO_INCREMENT,
    `IdUser` INT NOT NULL,
    `Token` text,
    `PublicKey` blob,
    `UserAuthId` text,
    `Counter` bigint,
    `DeviceType` varchar(255),
    FOREIGN KEY (`IdUser`) REFERENCES `users`(`IdUser`) ON DELETE CASCADE
);

ALTER TABLE
    `users`
ADD
    `Token` varchar(255);