import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";

export class GenerateReports {

    public async run(request: NextRequest) {
        let body = await request.json() as RelatorioFormData

        let { start, end } = this.getStartEnd(body)

        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let expenseData = await baseExpensesUseCases.GetReports.run(start, end, session.IdUser, body, Boolean(body.date))

        let chartData = this.generateChartData(expenseData, body.interval)

        let dateArray = this.generateDateArray(expenseData)

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

    private getStartEnd(body: RelatorioFormData) {

        if (body.dateStart && body.dateEnd) {
            let start = moment(clientUtilsUseCases.handleClientDate(body.dateStart)).startOf("day")
            let end = moment(clientUtilsUseCases.handleClientDate(body.dateEnd)).endOf("day")

            return { start, end }
        }

        if (body.date) {
            let monthMoment = moment(body.date, "YYYY-MM")

            let start = monthMoment.startOf("month").startOf("day").clone()
            let end = monthMoment.endOf("month").endOf("day").clone()

            return { start, end }
        }

        throw new Error("Body sem (dateStart, dateEnd) ou date")
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

    private generateDateArray(expenseData: FullBaseExpenseChild[]) {

        let dates = expenseData.map((item) => clientUtilsUseCases.GetExpenseDate(item).getTime())

        let arrayStart = moment(Math.min(...dates))
        let arrayEnd = moment(Math.max(...dates))

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
    date?: string
    dateStart?: string
    dateEnd?: string
    description?: string
    IdExpenseCategory?: string
    IdDestiny?: string
    IdBank?: string
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