import { baseexpenses, defaultexpenses, fixedexpenses, installmentexpenses } from "@prisma/client"
import { BaseSection } from "../../base"
import { utilsUseCases } from "../Utils/UtilsUseCases"
import { defaultExpensesUseCases } from "../DefaultExpenses/DefaultExpensesUseCases"
import { fixedExpensesUseCases } from "../FixedExpenses/FixedExpensesUseCases"
import { installmentExpensesUseCases } from "../InstallmentExpenses/InstallmentExpensesUseCases"
import { BaseExpensesUseCases } from "./BaseExpensesUseCases"

export class GenerateFullBaseExpenseChild extends BaseSection<BaseExpensesUseCases> {

    async run(baseExpenses: baseexpenses[]) {
        let IdBaseExpenses = baseExpenses.map((item) => item.IdBaseExpense)

        if (IdBaseExpenses.length === 0) {
            return []
        }

        let typesExpenses = await this.getTypesExpenses(IdBaseExpenses)

        return baseExpenses.map<FullBaseExpenseChild>((item) => {
            let defaultExpense = typesExpenses.defaultExpenses.find((subItem) => subItem.IdBaseExpense === item.IdBaseExpense)
            let fixedExpense = typesExpenses.fixedExpenses.find((subItem) => subItem.IdBaseExpense === item.IdBaseExpense)
            let installmentExpense = typesExpenses.installmentExpenses.find((subItem) => subItem.IdBaseExpense === item.IdBaseExpense)

            return Object.assign(item, { child: defaultExpense || fixedExpense || installmentExpense })
        })
    }

    private getTypesExpenses(IdBaseExpenses: number[]) {
        return utilsUseCases.resolvePromiseObj({
            defaultExpenses: defaultExpensesUseCases.getByBaseExpense(IdBaseExpenses),
            fixedExpenses: fixedExpensesUseCases.getByBaseExpense(IdBaseExpenses),
            installmentExpenses: installmentExpensesUseCases.getByBaseExpense(IdBaseExpenses),
        })
    }
}

//#region Interfaces / Types 

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

//#endregion