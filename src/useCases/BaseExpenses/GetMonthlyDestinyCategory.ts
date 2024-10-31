import { BaseSection } from "@/base/baseSection";
import { BaseExpensesUseCases } from "./BaseExpensesUseCases"
import { destinysUseCases } from "../Destinys/DestinysUseCases";
import { sistemParamsUseCases } from "../SistemParams/SistemParamsUseCases";
import { FullBaseExpenseChild } from "./generateFullBaseExpenseChild";

export class GetMonthlyDestinyCategory extends BaseSection<BaseExpensesUseCases> {

    async run(month: number, year: number, IdUser: number, IdDestiny: number, IdExpenseCategory: number): Promise<FullBaseExpenseChild[]> {
        let result = await Promise.all([
            this.checkJointExpenses(month, year, IdUser, IdDestiny, IdExpenseCategory),
            this.instance.GenerateFullBaseExpenseChild.run(month, year, IdUser, { IdDestiny, IdExpenseCategory })
        ])

        return result.flat()
    }

    private async checkJointExpenses(month: number, year: number, IdUser: number, IdDestiny: number, IdExpenseCategory: number): Promise<FullBaseExpenseChild[]> {
        let splitDestinys = await destinysUseCases.getBy({ SplitJointExpense: true, IdUser })
        let destiny = await destinysUseCases.getFirstBy({ IdDestiny })

        if (!destiny || !destiny.SplitJointExpense) return []

        let params = await sistemParamsUseCases.getParam("IdDestinoConjunto", month, year)

        if (!params) {
            return []
        }

        let expenses = await this.instance.GenerateFullBaseExpenseChild.run(month, year, IdUser, { IdDestiny: parseInt(params.Value), IdExpenseCategory })

        expenses.forEach((item) => {
            item.splitCount = splitDestinys.length
            item.obs = "Despesa conjunta"
        })

        return expenses
    }
}

//#region Interfaces / Types



//#endregion