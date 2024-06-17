'use client';

import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { RelatorioFormData, RelatorioData } from "@/app/api/relatorios/route";
import { useForm } from "react-hook-form";
import { relatoriosEvents } from "../events";
import { expensecategories } from "@prisma/client";
import { ReportForm } from "./reportForm";
import { ReportChart } from "./reportChart";
import { ExpenseTable } from "../../components/ExpenseTable/ExpenseTable";
import moment from "moment";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";

//#region Functions 

export function ReportBody(props: ReportBodyProps) {
    let start = moment().startOf("month").format("YYYY-MM-DD")
    let end = moment().format("YYYY-MM-DD")

    let { register, handleSubmit } = useForm<RelatorioFormData>({ defaultValues: { interval: "semana", dateStart: start, dateEnd: end } })

    let [chartConfig, setChartConfig] = useState<RelatorioData['chartData']>({ labels: [], data: [] })
    let [tableData, setTableData] = useState<RelatorioData['tableData']>([])
    let [isLoading, setLoading] = useState(false)

    let sumExpenses = tableData.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item), 0)

    return (
        <div className="flex flex-col gap-10">
            {
                isLoading ?
                    <CircularProgress /> :
                    <ReportForm
                        expenseCategories={props.expenseCategories}
                        register={register}
                        onSubmit={handleSubmit((requestData) => relatoriosEvents.search({ requestData, setChartConfig, setLoading, setTableData }))}
                    />
            }
            <ReportChart chartConfig={chartConfig} />

            <h1 className="w-fit m-auto">Total: R$ {sumExpenses.toFixed(2)}</h1>

            <ExpenseTable data={tableData} />
        </div>
    )
}

//#endregion

//#region Interfaces / Types 

interface ReportBodyProps {
    expenseCategories: expensecategories[]
}

//#endregion