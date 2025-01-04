ALTER TABLE
    `destinys`
ADD
    `Position` int;

ALTER TABLE
    `banks`
ADD
    `Position` int;

ALTER TABLE
    `expensecategories`
ADD
    `Position` int;

UPDATE
    `destinys`
SET
    `Position` = 1;
UPDATE
    `banks`
SET
    `Position` = 1;

UPDATE
    `expensecategories`
SET
    `Position` = 1;