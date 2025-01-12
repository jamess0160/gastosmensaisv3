import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import { nfeExpensesUseCases } from "@/useCases/NfeExpenses/NfeExpensesUseCases";
import { NfeReportItem } from "@/useCases/NfeExpenses/GetReports/GetReports";
import { GenerateNfeChartData } from "./generateNfeReports/GenerateNfeChartData";

export class GenerateNfeReports {

    private readonly GenerateNfeChartData = new GenerateNfeChartData(this)

    public async run(request: NextRequest) {
        let body = await request.json() as NfeReportFormData

        let { start, end } = this.getStartEnd(body)

        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let expenseData = await nfeExpensesUseCases.GetReports.run(start, end, session.IdUser, body, Boolean(body.date))

        let dateArray = this.generateDateArray(expenseData)

        let labels = Array.from(new Set(dateArray.map((item) => this.getDateLabel(item, body.interval))))

        let chartData = this.GenerateNfeChartData.run(expenseData, body.interval, labels)

        return NextResponse.json(<NfeReportData>{
            chartData: chartData,
            tableData: expenseData
        })
    }

    private getStartEnd(body: NfeReportFormData) {

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

    private generateDateArray(expenseData: NfeReportItem[]) {

        let dates = expenseData.map((item) => new Date(item.ExpenseDate).getTime())

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

    public getDateLabel(expenseDate: moment.Moment, interval: NfeReportFormData['interval']) {
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

        if (interval === "soma") {
            return "Total"
        }

        return ""
    }

}

//#region Interfaces / Types 

export interface NfeReportFormData {
    interval: "mes" | "semana" | "dia" | "soma"
    date?: string
    dateStart?: string
    dateEnd?: string
    description?: string
    IdNfeItemCategory?: string
    IdBank?: string
}

export interface NfeReportData {
    tableData: NfeReportItem[]
    chartData: NfeReportChartData
}

interface NfeReportChartData {
    labels: string[]
    data: ChartDataSets[]
}

interface ChartDataSets {
    label: string
    color: string
    data: number[]
}

//#endregion