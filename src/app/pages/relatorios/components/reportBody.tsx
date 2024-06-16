'use client';

import { useState } from "react";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";
import { CircularProgress } from "@mui/material";
import { RelatorioFormData, RelatorioData } from "@/app/api/relatorios/route";
import { useForm } from "react-hook-form";
import { relatoriosEvents } from "../events";
import { expensecategories } from "@prisma/client";
import { ReportForm } from "./reportForm";
import { ReportChart } from "./reportChart";
import { ExpenseTable } from "../../components/ExpenseTable/ExpenseTable";

//#region Functions 

export function ReportBody(props: ReportBodyProps) {
    let date = clientUtilsUseCases.monthAndYearToMoment(props.monthYear.month, props.monthYear.year)
    let now = date.format("YYYY-MM-DD")

    let { register, handleSubmit } = useForm<RelatorioFormData>({ defaultValues: { dateStart: now, dateEnd: now } })

    let [chartConfig, setChartConfig] = useState<RelatorioData['chartData']>({ labels: [], data: [] })
    let [tableData, setTableData] = useState<RelatorioData['tableData']>([])
    let [isLoading, setLoading] = useState(false)


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
            <ExpenseTable data={tableData} />
        </div>
    )
}

//#endregion

//#region Interfaces / Types 

interface ReportBodyProps {
    monthYear: { month: number, year: number }
    expenseCategories: expensecategories[]
}

//#endregion