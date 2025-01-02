import moment from "moment"
import { GetExpenseType } from "./getExpensePrice"
import type { FullBaseExpenseChild } from "../BaseExpenses/generateFullBaseExpenseChild"
import { dialogs } from "@/app/pages/components/Dialogs/dialogs"
import axios, { AxiosError } from "axios"

export class ClientUtilsUseCases {

    readonly GetExpenseType = new GetExpenseType(this)

    public readonly months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

    GetExpensePrice(expense: FullBaseExpenseChild, options: GetExpensePriceOptions) {

        let splitCount = options.split !== false ? expense.expensedestinys.length : 1

        if (Boolean(options?.sumInactive) === false && expense.Active === false) {
            return 0
        }

        if (this.GetExpenseType.isDefault(expense)) {
            return (expense.Price) / splitCount
        }

        if (this.GetExpenseType.isFixed(expense)) {
            return (expense.child.Price || expense.Price) / splitCount
        }

        if (this.GetExpenseType.isInstallment(expense)) {
            return (expense.child.Price || expense.Price) / splitCount
        }

        return 0
    }

    GetExpenseDate(expense: FullBaseExpenseChild) {

        if (this.GetExpenseType.isDefault(expense)) {
            return expense.child.ExpenseDate
        }

        return expense.EntryDate
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
        return moment().set("month", month).set("year", year).startOf("month")
    }

    parseLeftZero(value: number) {
        if (value >= 10) {
            return value.toString()
        }

        return "0" + value
    }

    handleClientDate(date?: string) {
        if (!date) return

        let momentDate = moment(date, "DD/MM/YYYY")

        if (momentDate.isValid() === false) {
            momentDate = moment(date, "YYYY-MM-DD")
        }

        return momentDate.toDate()
    }

    handleClientMonth(date?: string) {
        if (!date) return

        return moment(date, "YYYY-MM").startOf("month").toDate()
    }

    handleTableData<T = any>(data: T[], minRowCount = 10): Array<T | false> {

        let tableData = data as Array<T | false>

        if (data.length < minRowCount) {
            let count = minRowCount - data.length
            for (let i = 0; i < count; i++) {
                tableData.push(false)
            }
        }

        return tableData
    }

    sleep(miliSeconds: number) {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, miliSeconds);
        })
    }

    handleError(error: any, title: string) {
        console.log(error)

        axios.post("/api/logs", {
            type: `Log navegador: ${title}`,
            msg: error.toString(),
            stack: error.stack?.split("\n"),
            hash: location.hash,
            data: error.response?.data
        }).catch(() => { })

        if (error instanceof AxiosError && error.response?.status === 406) {
            return this.handleServerMessage(title, error.response.data)
        }

        return dialogs.Error.show(title)
    }

    private handleServerMessage(title: string, data: any) {
        if (data.type === "error") {
            return dialogs.Error.show(data.msg, title)
        }

        if (data.type === "redirect") {
            location.href = data.url
        }
    }
}

export const clientUtilsUseCases = new ClientUtilsUseCases()

interface GetExpensePriceOptions {
    split: boolean
    sumInactive?: boolean
}