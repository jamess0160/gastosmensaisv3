'use client';

import { useState } from "react";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";
import { Button, CircularProgress } from "@mui/material";
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
    let month = date.format("YYYY-MM")

    let { register, handleSubmit } = useForm<RelatorioFormData>({ defaultValues: { dateStart: month, dateEnd: month } })

    let [chartConfig, setChartConfig] = useState<RelatorioData['chartData']>({ labels: [], data: [] })
    let [tableData, setTableData] = useState<RelatorioData['tableData']>([])

    let [isLoading, setLoading] = useState(false)

    return (
        <form
            className="flex flex-col gap-10"
            onSubmit={handleSubmit((requestData) => relatoriosEvents.search({ requestData, setChartConfig, setLoading, setTableData }))}
        >

            <ReportForm register={register} expenseCategories={props.expenseCategories} />

            <div className="w-full flex justify-center">
                {isLoading ? <CircularProgress /> : <Button type="submit" className="w-1/4" variant="contained">Pesquisar</Button>}
            </div>

            <ReportChart chartConfig={chartConfig} />
            <ExpenseTable data={tableData} />
        </form>
    )
}

//#endregion

//#region Interfaces / Types 

interface ReportBodyProps {
    monthYear: { month: number, year: number }
    expenseCategories: expensecategories[]
}

//#endregion