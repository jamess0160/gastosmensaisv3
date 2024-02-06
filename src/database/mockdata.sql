-- Active: 1706977966627@@127.0.0.1@3306@gastosmensaisv3
INSERT INTO
    `Destinys` (`Name`)
VALUES
    ('Tiago'),
    ('Luana'),
    ('Geral'),
    ('Conjunto');

INSERT INTO
    `CashInflows` (`Description`, `IdDestiny`, `Value`)
VALUES
    ('Salário Tiago', 4, 3600),
    ('Salário Luana', 4, 1200);

INSERT INTO
    `Banks` (`Name`, `IconPath`)
VALUES
    ('Pix / Debito', 'TESTE'),
    ('Nubank Tiago', 'TESTE'),
    ('Nubank Luana', 'TESTE'),
    ('Inter', 'TESTE');

INSERT INTO
    `SistemParams` (`Key`, `Value`)
VALUES
    ('ValorMaximoGeral', '1400'),
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
    ('Teste Default', 1, 1, 1, 20),
    ('Teste Fixed', 1, 1, 1, 30),
    ('Teste Installment', 1, 1, 1, 40);

INSERT INTO
    `DefaultExpenses` (`IdBaseExpense`)
VALUES
    (1);

INSERT INTO
    `FixedExpenses` (`IdBaseExpense`, `EndDate`)
VALUES
    (1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 MONTH));

INSERT INTO
    `InstallmentExpenses` (
        `IdBaseExpense`,
        `CurrentInstallment`,
        `MaxInstallment`
    )
VALUES
    (1, 1, 2),
    (1, 2, 2);