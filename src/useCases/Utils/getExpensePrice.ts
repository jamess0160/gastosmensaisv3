import { DefaultExpenseChild, FixedExpenseChild, FullBaseExpenseChild, InstallmentExpenseChild } from "../BaseExpenses/getMonthlyBankCategory";

export function getExpensePrice(expense: FullBaseExpenseChild) {
    if (isDefault(expense)) {
        return expense.Price
    }

    if (isFixed(expense)) {
        return expense.child.Price || expense.Price
    }

    if (isInstallment(expense)) {
        return expense.child.Price || expense.Price
    }

    return expense.Price
}

function isDefault(expense: any): expense is DefaultExpenseChild {
    return expense.child.IdDefaultExpense
}

function isFixed(expense: any): expense is FixedExpenseChild {
    return expense.child.IdFixedExpense
}

function isInstallment(expense: any): expense is InstallmentExpenseChild {
    return expense.child.IdInstallmentExpense
}