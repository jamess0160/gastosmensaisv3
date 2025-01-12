import { NfeReportItem } from "@/useCases/NfeExpenses/GetReports/GetReports"
import { GenerateNfeReports, NfeReportData, NfeReportFormData } from "../generateNfeReports"
import moment from "moment"
import { BaseSection } from "@/base/baseSection"

export class GenerateChartData extends BaseSection<GenerateNfeReports> {

    public run(expenseData: NfeReportItem[], interval: NfeReportFormData['interval'], labels: string[]): NfeReportChartData {

        let nfeItemCategories = this.getChartGroup(expenseData)

        if (nfeItemCategories.length > 1) {
            nfeItemCategories.unshift({
                Color: "#2e5a77",
                Description: "Total"
            })
        }

        let groupedData = this.groupExpenseData(expenseData, interval)

        return {
            labels: labels,
            data: nfeItemCategories.map((item) => {
                return {
                    label: item.Description,
                    color: item.Color || "black",
                    data: labels.map((label) => {

                        let expenses: NfeReportItem[] = []

                        if (item.IdNfeItemCategory) {
                            expenses = groupedData[`${label}-${item.IdNfeItemCategory}`]
                        } else {
                            expenses = groupedData[label]
                        }

                        if (!expenses) {
                            return 0
                        }

                        return Number(expenses.reduce((old, item) => {
                            return old + (item.TotalValue || 0)
                        }, 0).toFixed(2))
                    })
                }
            })
        }
    }

    private getChartGroup(expenseData: NfeReportItem[]) {
        return Object.values(expenseData.reduce<Record<string, ChartGroupData>>((old, item) => {

            if (!item.IdNfeItemCategory || old[item.IdNfeItemCategory.toString()] || !item.nfeitemcategories) {
                return old
            }

            old[item.IdNfeItemCategory.toString()] = {
                IdNfeItemCategory: item.IdNfeItemCategory,
                Color: item.nfeitemcategories.Color || "black",
                Description: item.nfeitemcategories.Description
            }

            return old
        }, {}))
    }

    private groupExpenseData(expenseData: NfeReportItem[], interval: NfeReportFormData['interval']) {
        return expenseData.reduce<Record<string, NfeReportItem[]>>((old, item) => {
            let itemLabel = this.instance.getDateLabel(moment(item.ExpenseDate), interval)

            if (!old[`${itemLabel}-${item.IdNfeItemCategory}`]) {
                old[`${itemLabel}-${item.IdNfeItemCategory}`] = []
            }

            if (!old[itemLabel]) {
                old[itemLabel] = []
            }

            old[`${itemLabel}-${item.IdNfeItemCategory}`].push(item)
            old[itemLabel].push(item)

            return old
        }, {})
    }
}

type NfeReportChartData = NfeReportData['chartData']

interface ChartGroupData {
    IdNfeItemCategory?: number
    Color: string
    Description: string
}