import { BaseUseCase } from "../../base/baseUseCase"
import { baseExpensesUseCases } from "../BaseExpenses/BaseExpensesUseCases"
import { fixedExpensesUseCases } from "../FixedExpenses/FixedExpensesUseCases"
import { serverUtilsUseCases } from "../Utils/ServerUtilsUseCases/ServerUtilsUseCases"
import { GetCategoriesData } from "./sections/GetCategoriesData"
import { CreateExpense } from "./sections/createExpense"
import { UpdateExpense } from "./sections/updateExpense"

export class ExpensesUseCase extends BaseUseCase {
    CreateExpense = new CreateExpense(this)
    UpdateExpense = new UpdateExpense(this)
    GetCategoriesData = new GetCategoriesData(this)

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