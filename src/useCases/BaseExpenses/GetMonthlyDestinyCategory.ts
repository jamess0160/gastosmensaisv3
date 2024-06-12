import { BaseSection } from "@/base/baseSection";
import { BaseExpensesUseCases } from "./BaseExpensesUseCases"
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases";
import { destinysUseCases } from "../Destinys/DestinysUseCases";
import { sistemParamsUseCases } from "../SistemParams/SistemParamsUseCases";
import { FullBaseExpenseChild } from "./generateFullBaseExpenseChild";

export class GetMonthlyDestinyCategory extends BaseSection<BaseExpensesUseCases> {

    async run(month: number, year: number, IdDestiny: number, IdExpenseCategory: number): Promise<FullBaseExpenseChild[]> {
        let result = await Promise.all([
            this.checkJointExpenses(month, year, IdDestiny, IdExpenseCategory),
            this.instance.GenerateFullBaseExpenseChild.run(month, year, { IdDestiny, IdExpenseCategory })
        ])

        return result.flat()
    }

    private async checkJointExpenses(month: number, year: number, IdDestiny: number, IdExpenseCategory: number): Promise<FullBaseExpenseChild[]> {
        let splitDestinys = await destinysUseCases.getBy({ SplitJointExpense: true })
        let destiny = await destinysUseCases.getFirstBy({ IdDestiny })

        if (!destiny || !destiny.SplitJointExpense) return []

        let params = await sistemParamsUseCases.getParam("IdDestinoConjunto", clientUtilsUseCases.monthAndYearToMoment(month, year).toDate())

        if (!params) {
            return []
        }

        let expenses = await this.instance.GenerateFullBaseExpenseChild.run(month, year, { IdDestiny: parseInt(params.Value), IdExpenseCategory })

        expenses.forEach((item) => {
            item.splitCount = splitDestinys.length
            item.obs = "Despesa conjunta"
        })

        return expenses
    }
}

//#region Interfaces / Types



//#endregion