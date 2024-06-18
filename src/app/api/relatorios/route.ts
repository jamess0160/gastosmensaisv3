import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases";
import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let body = await request.json() as RelatorioFormData

    let start = moment(clientUtilsUseCases.handleClientDate(body.dateStart)).startOf("day")
    let end = moment(clientUtilsUseCases.handleClientDate(body.dateEnd)).endOf("day")

    let expenseData = await baseExpensesUseCases.GetReports.run(start, end, body.description, body.IdExpenseCategory)


    let chartData = expenseData.reduce<Record<string, number>>((old, item) => {

        let label = getDateLabel(moment(clientUtilsUseCases.GetExpenseDate(item)), body.interval)

        if (!old[label]) {
            old[label] = 0
        }

        old[label] += clientUtilsUseCases.GetExpensePrice(item)

        return old
    }, {})

    let dateArray = generateDateArray(start, end)

    let labels = dateArray.map((item) => getDateLabel(item, body.interval))

    return NextResponse.json(<RelatorioData>{
        chartData: labels.reduce<RelatorioChartData>((old, label) => {

            old.labels.push(label)
            old.data.push(chartData[label] || 0)

            return old
        }, { labels: [], data: [] }),
        tableData: expenseData
    })
}

function generateDateArray(arrayStart: moment.Moment, arrayEnd: moment.Moment) {
    let start = arrayStart.clone()
    let end = arrayEnd.clone()

    let dateArray = [];

    while (start <= end) {
        dateArray.push(start.clone());
        start.add(1, "day");
    }

    return dateArray;
}

function getDateLabel(expenseDate: moment.Moment, interval: RelatorioFormData['interval']) {
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