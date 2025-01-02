import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";

export class GenerateReports {

    public async run(request: NextRequest) {
        let body = await request.json() as RelatorioFormData

        let start = moment(clientUtilsUseCases.handleClientDate(body.dateStart)).startOf("day")
        let end = moment(clientUtilsUseCases.handleClientDate(body.dateEnd)).endOf("day")
        
        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let expenseData = await baseExpensesUseCases.GetReports.run(start, end, session.IdUser, body.description, body.IdExpenseCategory)

        let chartData = this.generateChartData(expenseData, body.interval)

        let dateArray = this.generateDateArray(start, end)

        let labels = Array.from(new Set(dateArray.map((item) => this.getDateLabel(item, body.interval))))

        return NextResponse.json(<RelatorioData>{
            chartData: labels.reduce<RelatorioChartData>((old, label) => {

                old.labels.push(label)
                old.data.push(chartData[label] ? Number(chartData[label].toFixed(2)) : 0)

                return old
            }, { labels: [], data: [] }),
            tableData: expenseData
        })
    }

    private generateChartData(expenseData: FullBaseExpenseChild[], interval: RelatorioFormData['interval']) {
        return expenseData.reduce<Record<string, number>>((old, item) => {

            let label = this.getDateLabel(moment(clientUtilsUseCases.GetExpenseDate(item)), interval)

            if (!old[label]) {
                old[label] = 0
            }

            old[label] += clientUtilsUseCases.GetExpensePrice(item, { split: false })

            return old
        }, {})
    }

    private generateDateArray(arrayStart: moment.Moment, arrayEnd: moment.Moment) {
        let start = arrayStart.clone()
        let end = arrayEnd.clone()

        let dateArray = [];

        while (start <= end) {
            dateArray.push(start.clone());
            start.add(1, "day");
        }

        return dateArray;
    }

    private getDateLabel(expenseDate: moment.Moment, interval: RelatorioFormData['interval']) {
        if (interval === 'mes') {
            return clientUtilsUseCases.months[expenseDate.get("month")]
        }

        if (interval === "semana") {
            let start = expenseDate.startOf("week").toDate().toLocaleDateString("pt-br")
            let end = expenseDate.endOf("week").toDate().toLocaleDateString("pt-br")

            return `${start} - ${end}`
        }

        if (interval === "dia") {
            return expenseDate.toDate().toLocaleDateString("pt-br")
        }

        return ""
    }

}

//#region Interfaces / Types 

export interface RelatorioFormData {
    interval: "mes" | "semana" | "dia"
    dateStart: string
    dateEnd: string
    description?: string
    IdExpenseCategory?: string
}

export interface RelatorioData {
    tableData: FullBaseExpenseChild[]
    chartData: RelatorioChartData
}

interface RelatorioChartData {
    labels: string[]
    data: number[]
}

//#endregion