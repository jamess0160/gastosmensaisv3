import moment from "moment"
import { BaseSection } from "@/base/baseSection"
import { ExpenseReportData, ExpenseReportFormData, GenerateExpenseReports } from "../generateExpenseReports"
import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild"
import { expensecategories } from "@prisma/client"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"

export class GenerateExpenseChartData extends BaseSection<GenerateExpenseReports> {

    public run(expenseData: FullBaseExpenseChild[], interval: ExpenseReportFormData['interval'], labels: string[], expenseCategories: expensecategories[]): NfeReportChartData {

        let groups = this.getChartGroup(expenseData, expenseCategories)

        if (groups.length > 1 && interval !== "soma") {
            groups.unshift({
                Color: "#2e5a77",
                Description: "Total"
            })
        }

        let groupedData = this.groupExpenseData(expenseData, interval)

        return {
            labels: labels,
            data: groups.map((item) => {
                return {
                    label: item.Description,
                    color: item.Color || "black",
                    data: labels.map((label) => {

                        let expenses: FullBaseExpenseChild[] = []

                        if (item.IdExpenseCategory) {
                            expenses = groupedData[`${label}-${item.IdExpenseCategory}`]
                        } else {
                            expenses = groupedData[label]
                        }

                        if (!expenses) {
                            return 0
                        }

                        return Number(expenses.reduce((old, item) => {
                            return old + clientUtilsUseCases.GetExpensePrice(item, { split: false })
                        }, 0).toFixed(2))
                    })
                }
            })
        }
    }

    private getChartGroup(expenseData: FullBaseExpenseChild[], expenseCategories: expensecategories[]) {

        return Object.values(expenseData.reduce<Record<string, ChartGroupData>>((old, item) => {

            if (!item.IdExpenseCategory || old[item.IdExpenseCategory.toString()]) {
                return old
            }

            let itemCategory = expenseCategories.find((subItem) => subItem.IdExpenseCategory === item.IdExpenseCategory)

            if (!itemCategory) {
                return old
            }

            old[item.IdExpenseCategory.toString()] = {
                IdExpenseCategory: itemCategory.IdExpenseCategory,
                Color: itemCategory.Color || "black",
                Description: itemCategory.Description
            }

            return old
        }, {}))
    }

    private groupExpenseData(expenseData: FullBaseExpenseChild[], interval: ExpenseReportFormData['interval']) {
        return expenseData.reduce<Record<string, FullBaseExpenseChild[]>>((old, item) => {

            let date = moment(clientUtilsUseCases.GetExpenseDate(item))
            let itemLabel = this.instance.getDateLabel(date, interval)

            if (!old[`${itemLabel}-${item.IdExpenseCategory}`]) {
                old[`${itemLabel}-${item.IdExpenseCategory}`] = []
            }

            if (!old[itemLabel]) {
                old[itemLabel] = []
            }

            old[`${itemLabel}-${item.IdExpenseCategory}`].push(item)
            old[itemLabel].push(item)

            return old
        }, {})
    }
}

type NfeReportChartData = ExpenseReportData['chartData']

interface ChartGroupData {
    IdExpenseCategory?: number
    Color: string
    Description: string
}