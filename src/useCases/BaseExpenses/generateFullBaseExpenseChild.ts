import { baseexpenses, defaultexpenses, fixedexpenses, installmentexpenses } from "@prisma/client"
import { UtilsUseCases } from "../Utils/UtilsUseCases"
import { DefaultExpensesUseCases } from "../DefaultExpenses/DefaultExpensesUseCases"
import { FixedExpensesUseCases } from "../FixedExpenses/FixedExpensesUseCases"
import { InstallmentExpensesUseCases } from "../InstallmentExpenses/InstallmentExpensesUseCases"

export async function generateFullBaseExpenseChild(baseExpenses: baseexpenses[]) {
    let IdBaseExpenses = baseExpenses.map((item) => item.IdBaseExpense)

    if (IdBaseExpenses.length === 0) {
        return []
    }

    let typesExpenses = await getTypesExpenses(IdBaseExpenses)

    return baseExpenses.map<FullBaseExpenseChild>((item) => {
        let defaultExpense = typesExpenses.defaultExpenses.find((subItem) => subItem.IdBaseExpense === item.IdBaseExpense)
        let fixedExpense = typesExpenses.fixedExpenses.find((subItem) => subItem.IdBaseExpense === item.IdBaseExpense)
        let installmentExpense = typesExpenses.installmentExpenses.find((subItem) => subItem.IdBaseExpense === item.IdBaseExpense)

        return Object.assign(item, { child: defaultExpense || fixedExpense || installmentExpense })
    })
}

function getTypesExpenses(IdBaseExpenses: number[]) {
    return UtilsUseCases.resolvePromiseObj({
        defaultExpenses: DefaultExpensesUseCases.getByBaseExpense(IdBaseExpenses),
        fixedExpenses: FixedExpensesUseCases.getByBaseExpense(IdBaseExpenses),
        installmentExpenses: InstallmentExpensesUseCases.getByBaseExpense(IdBaseExpenses),
    })
}

export interface FullBaseExpenseChild extends baseexpenses {
    child: defaultexpenses | fixedexpenses | installmentexpenses | undefined
}

export interface DefaultExpenseChild extends baseexpenses {
    child: defaultexpenses
}

export interface FixedExpenseChild extends baseexpenses {
    child: fixedexpenses
}

export interface InstallmentExpenseChild extends baseexpenses {
    child: installmentexpenses
}