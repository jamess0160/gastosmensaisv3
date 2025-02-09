CREATE TABLE IgnoreAuth (
    `IdIgnoreAuth` int PRIMARY KEY AUTO_INCREMENT,
    `IdUser` int NOT NULL,
    `DeviceKey` varchar(255) NOT NULL,
    FOREIGN KEY (`IdUser`) REFERENCES Users(`IdUser`) ON DELETE CASCADE
);

ALTER TABLE
    Users DROP COLUMN `UseAuth`;