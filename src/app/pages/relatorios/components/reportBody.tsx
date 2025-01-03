'use client';

import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { relatoriosEvents } from "../events";
import { destinys, expensecategories } from "@prisma/client";
import { ReportForm } from "./reportForm";
import { ReportChart } from "./reportChart";
import { ExpenseTable } from "../../components/ExpenseTable/ExpenseTable";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { RelatorioData, RelatorioFormData } from "@/app/api/relatorios/controller/sections/POST/generateReports";

//#region Functions 

export function ReportBody(props: ReportBodyProps) {
    let currMoment = clientUtilsUseCases.monthAndYearToMoment(props.month, props.year)

    let start = currMoment.startOf("month").format("YYYY-MM-DD")
    let end = currMoment.endOf("month").format("YYYY-MM-DD")

    let form = useForm<RelatorioFormData>({ defaultValues: { interval: "semana", dateStart: start, dateEnd: end } })

    let [chartConfig, setChartConfig] = useState<RelatorioData['chartData']>({ labels: [], data: [] })
    let [tableData, setTableData] = useState<RelatorioData['tableData']>([])
    let [isLoading, setLoading] = useState(false)

    let sumExpenses = tableData.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item, { split: false }), 0)

    return (
        <div className="flex flex-col gap-10">
            {
                isLoading ?
                    <CircularProgress /> :
                    <ReportForm
                        expenseCategories={props.expenseCategories}
                        destinys={props.destinys}
                        form={form}
                        onSubmit={form.handleSubmit((requestData) => relatoriosEvents.search({ requestData, setChartConfig, setLoading, setTableData }))}
                    />
            }
            <ReportChart chartConfig={chartConfig} />

            <h1 className="w-fit m-auto">Total: R$ {sumExpenses.toFixed(2)}</h1>

            <ExpenseTable data={tableData} force={() => Promise.resolve()} />
        </div>
    )
}

//#endregion

//#region Interfaces / Types 

interface ReportBodyProps {
    expenseCategories: expensecategories[]
    destinys: destinys[]
    month: number
    year: number
}

//#endregion