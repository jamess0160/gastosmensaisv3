import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import { GenerateExpenseChartData } from "./generateExpenseReports/GenerateExpenseChartData";
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases";

export class GenerateExpenseReports {

    private readonly GenerateExpenseChartData = new GenerateExpenseChartData(this)

    public async run(request: NextRequest) {
        let body = await request.json() as ExpenseReportFormData

        let { start, end } = this.getStartEnd(body)

        let session = await serverUtilsUseCases.Cookies.getSession()

        if (!session) {
            return serverUtilsUseCases.SendClientMessage.run("redirect", { url: "/pages/login" })
        }

        let expenseData = await baseExpensesUseCases.GetReports.run(start, end, session.IdUser, body, Boolean(body.date))

        let expenseCategories = await expenseCategoriesUseCases.getAllByUser(session.IdUser)

        let dateArray = this.generateDateArray(expenseData)

        let labels = Array.from(new Set(dateArray.map((item) => this.getDateLabel(item, body.interval))))

        return NextResponse.json(<ExpenseReportData>{
            chartData: this.GenerateExpenseChartData.run(expenseData, body.interval, labels, expenseCategories),
            tableData: expenseData
        })
    }

    private getStartEnd(body: ExpenseReportFormData) {

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

    private generateDateArray(expenseData: FullBaseExpenseChild[]) {

        let dates = expenseData.reduce<number[]>((old, item) => {

            if (clientUtilsUseCases.GetExpenseType.isDefault(item) || clientUtilsUseCases.GetExpenseType.isNfe(item)) {
                old.push(new Date(clientUtilsUseCases.GetExpenseDate(item)).getTime())
            }

            return old
        }, [])

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

    public getDateLabel(expenseDate: moment.Moment, interval: ExpenseReportFormData['interval']) {
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

export interface ExpenseReportFormData {
    interval: "mes" | "semana" | "dia" | "soma"
    date?: string
    dateStart?: string
    dateEnd?: string
    description?: string
    IdExpenseCategory?: string
    IdDestiny?: string
    IdBank?: string
}

export interface ExpenseReportData {
    tableData: FullBaseExpenseChild[]
    chartData: ExpenseReportChartData
}

interface ExpenseReportChartData {
    labels: string[]
    data: ChartDataSets[]
}

interface ChartDataSets {
    label: string
    color: string
    data: number[]
}

//#endregion