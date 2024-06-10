-- Active: 1706977966627@@127.0.0.1@3306@gastos_mensais_v3
INSERT INTO
    `Destinys` (`Name`, `SplitJointExpense`, `Color`)
VALUES
    ('Luana', 1, '#463956'),
    ('Geral', 0, '#6d5f66'),
    ('Tiago', 1, '#3e697d'),
    ('Conjunto', 0, null);

INSERT INTO
    `CashInflows` (`Description`, `Value`)
VALUES
    ('Salário Tiago', 3600),
    ('Salário Luana', 1200);

INSERT INTO
    `Banks` (`Name`, `IconPath`)
VALUES
    ('Pix / Debito', '/bankIcons/pix.svg'),
    ('Nubank Tiago', '/bankIcons/nubank.svg'),
    ('Nubank Luana', '/bankIcons/nubank.svg'),
    ('Inter', '/bankIcons/inter.svg');

INSERT INTO
    `SistemParams` (`Key`, `Value`)
VALUES
    ('ValorMaximoGeral', '1400'),
    ('IdDestinoGeral', '2'),
    ('IdDestinoConjunto', '4');

INSERT INTO
    `ExpenseCategories` (`Description`)
VALUES
    ('Geral'),
    ('Transporte'),
    ('Alimentação');

INSERT INTO
    `BaseExpenses` (
        `Description`,
        `IdBank`,
        `IdDestiny`,
        `IdExpenseCategory`,
        `Price`
    )
VALUES
    ('Teste Default', 1, 3, 1, 20),
    ('Teste Fixed', 1, 3, 1, 30),
    ('Teste Installment', 1, 3, 1, 40);

INSERT INTO
    `DefaultExpenses` (`IdBaseExpense`)
VALUES
    (1);

INSERT INTO
    `FixedExpenses` (`IdBaseExpense`, `EndDate`)
VALUES
    (2, DATE_ADD(CURRENT_DATE(), INTERVAL 1 MONTH));

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