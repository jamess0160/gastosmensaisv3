CREATE TABLE `usersauth`(
    `IdUserAuth` INT PRIMARY KEY AUTO_INCREMENT,
    `IdUser` INT NOT NULL,
    `Token` text NOT NULL,
    `PublicKey` blob NOT NULL,
    `Counter` bigint NOT NULL,
    `DeviceType` varchar(255),
    FOREIGN KEY (`IdUser`) REFERENCES `users`(`IdUser`) ON DELETE CASCADE
);

ALTER TABLE
    `users`
ADD
    `UseAuth` boolean;