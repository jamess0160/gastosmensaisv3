import moment from "moment"
import { GetExpenseType } from "./getExpensePrice"
import type { FullBaseExpenseChild } from "../BaseExpenses/generateFullBaseExpenseChild"

export class ClientUtilsUseCases {

    readonly GetExpenseType = new GetExpenseType(this)

    public readonly months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

    GetExpensePrice(expense: FullBaseExpenseChild) {

        if (!expense.Active) {
            return 0
        }

        if (this.GetExpenseType.isDefault(expense)) {
            return expense.Price
        }

        if (this.GetExpenseType.isFixed(expense)) {
            return expense.child.Price || expense.Price
        }

        if (this.GetExpenseType.isInstallment(expense)) {
            return expense.child.Price || expense.Price
        }

        return 0
    }

    async resolvePromiseObj<T extends Record<string, Promise<any>>>(promises: T): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
        let arrayKeys = Object.keys(promises)
        let resultPromisses = await Promise.all(Object.values(promises))

        return resultPromisses.reduce((old, item, index) => {
            old[arrayKeys[index]] = item

            return old
        }, {})
    }

    monthAndYearToMoment(month: number, year: number) {
        return moment().startOf("month").set("month", month).set("year", year)
    }

    parseLeftZero(value: number) {
        if (value >= 10) {
            return value.toString()
        }

        return "0" + value
    }
}

export const clientUtilsUseCases = new ClientUtilsUseCases()