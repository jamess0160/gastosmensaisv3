-- Active: 1706977966627@@127.0.0.1@3306@gastos_mensais_v3
INSERT INTO
    `Users` (`Name`, `Login`, `Password`)
VALUES
    (
        'Tiago e Luana',
        'tilu',
        '202cb962ac59075b964b07152d234b70'
    );

INSERT INTO
    `Destinys` (`Name`, `SplitJointExpense`, `Color`, `IdUser`)
VALUES
    ('Luana', 1, '#463956', 1),
    ('Geral', 0, '#6d5f66', 1),
    ('Tiago', 1, '#3e697d', 1),
    ('Conjunto', 0, NULL, 1);

INSERT INTO
    `CashInflows` (`Description`, `Value`, `IdDestiny`, `IdUser`)
VALUES
    ('Salário Tiago', 3600, 2, 1),
    ('Salário Luana', 1200, 2, 1);

INSERT INTO
    `Banks` (`Name`, `IconPath`, `IdUser`)
VALUES
    ('Pix / Debito', '/bankIcons/pix.svg', 1),
    ('Nubank Tiago', '/bankIcons/nubank.svg', 1),
    ('Nubank Luana', '/bankIcons/nubank.svg', 1),
    ('Inter', '/bankIcons/inter.svg', 1);

INSERT INTO
    `SistemParams` (`Key`, `Value`, `IdUser`)
VALUES
    ('ValorMaximoGeral', '1400', 1),
    ('IdDestinoGeral', '2', 1),
    ('IdDestinoConjunto', '4', 1);

INSERT INTO
    `ExpenseCategories` (`Description`, `IdUser`)
VALUES
    ('Geral', 1),
    ('Transporte', 1),
    ('Alimentação', 1);

INSERT INTO
    `BaseExpenses` (
        `Description`,
        `IdBank`,
        `IdDestiny`,
        `IdExpenseCategory`,
        `Price`,
        `IdUser`
    )
VALUES
    ('Teste Default', 1, 3, 1, 20, 1),
    ('Teste Fixed', 1, 3, 1, 30, 1),
    ('Teste Installment', 1, 3, 1, 40, 1);

INSERT INTO
    `DefaultExpenses` (`IdBaseExpense`)
VALUES
    (1);

INSERT INTO
    `FixedExpenses` (`IdBaseExpense`)
VALUES
    (2);

INSERT INTO
    `InstallmentExpenses` (
        `IdBaseExpense`,
        `CurrentInstallment`,
        `MaxInstallment`,
        `ExpectedDate`
    )
VALUES
    (3, 1, 2, CURRENT_DATE()),
    (
        3,
        2,
        2,
        DATE_ADD(CURRENT_DATE(), INTERVAL 1 MONTH)
    );