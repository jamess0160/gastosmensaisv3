'use client';

import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { relatoriosEvents } from "../events";
import { banks, destinys, expensecategories } from "@prisma/client";
import { ReportForm } from "./reportForm";
import { ReportChart } from "./reportChart";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { ExpenseReportData, ExpenseReportFormData } from "@/app/api/relatorios/controller/sections/POST/generateExpenseReports";
import { ExpenseTable } from "@/app/pages/components/ExpenseTable/ExpenseTable";

//#region Functions 

const defaultChart = { labels: [""], data: [] }

export function ReportBody(props: ReportBodyProps) {

    let form = useForm<ExpenseReportFormData>({ defaultValues: { interval: "semana" } })

    let [chartConfig, setChartConfig] = useState<ExpenseReportData['chartData']>(defaultChart)
    let [tableData, setTableData] = useState<ExpenseReportData['tableData']>([])
    let [isLoading, setLoading] = useState(false)

    let sumExpenses = tableData.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item, { split: false }), 0)

    return (
        <div className="flex flex-col gap-10 items-center">
            {
                isLoading ?
                    <CircularProgress /> :
                    <ReportForm
                        expenseCategories={props.expenseCategories}
                        destinys={props.destinys}
                        banks={props.banks}
                        form={form}
                        onSubmit={form.handleSubmit((requestData) => relatoriosEvents.search({ requestData, setChartConfig, setLoading, setTableData }))}
                        onClear={() => {
                            form.setValue("date", undefined)
                            form.setValue("dateStart", undefined)
                            form.setValue("dateEnd", undefined)
                            form.setValue("description", undefined)
                            form.setValue("IdExpenseCategory", undefined)
                            form.setValue("IdDestiny", undefined)
                            form.setValue("IdBank", undefined)
                            setTableData([])
                            setChartConfig(defaultChart)
                        }}
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
    banks: banks[]
    month: number
    year: number
}

//#endregion