import { BaseUseCase } from "../../base/baseUseCase"
import { baseExpensesUseCases } from "../BaseExpenses/BaseExpensesUseCases"
import { fixedExpensesUseCases } from "../FixedExpenses/FixedExpensesUseCases"
import { serverUtilsUseCases } from "../Utils/ServerUtilsUseCases"
import { CreateExpense } from "./createExpense"
import { UpdateExpense } from "./updateExpense"

export class ExpensesUseCase extends BaseUseCase {
    CreateExpense = new CreateExpense(this)
    UpdateExpense = new UpdateExpense(this)

    async deleteExpense(IdBaseExpense: number) {
        let baseExpenses = await baseExpensesUseCases.getUnique(IdBaseExpense)
        let [fixed] = await baseExpensesUseCases.getUnique(IdBaseExpense).fixedexpenses({ where: { EndDate: null } })

        if (fixed && serverUtilsUseCases.compareDates(baseExpenses.EntryDate) === false) {

            let EndDate = serverUtilsUseCases.getCurrMoment().subtract(1, "month").toDate()

            return fixedExpensesUseCases.update(fixed.IdFixedExpense, { EndDate })
        }

        return baseExpensesUseCases.delete(IdBaseExpense)
    }
}

export const expensesUseCase = new ExpensesUseCase()