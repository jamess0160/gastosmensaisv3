ALTER TABLE
    `usersauth` DROP COLUMN `DeviceType`;

ALTER TABLE
    `usersauth`
ADD
    `DeviceKey` varchar(255);