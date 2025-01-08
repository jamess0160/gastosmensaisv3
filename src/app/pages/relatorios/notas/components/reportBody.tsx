'use client';

import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { relatoriosEvents } from "../events";
import { banks, expensecategories, nfeitemcategories } from "@prisma/client";
import { ReportForm } from "./reportForm";
import { ReportChart } from "./reportChart";
import { NfeTable } from "@/app/pages/components/NfeTable/NfeTable";
import { NfeReportData, NfeReportFormData } from "@/app/api/relatorios/controller/sections/POST/generateNfeReports";

//#region Functions 

export function ReportBody(props: ReportBodyProps) {

    let form = useForm<NfeReportFormData>({ defaultValues: { interval: "semana" } })

    let [chartConfig, setChartConfig] = useState<NfeReportData['chartData']>({ labels: [], data: [] })
    let [tableData, setTableData] = useState<NfeReportData['tableData']>([])
    let [isLoading, setLoading] = useState(false)

    let sumExpenses = tableData.reduce((old, item) => old + (item.TotalValue || 0), 0)

    return (
        <div className="flex flex-col gap-10 items-center">
            {
                isLoading ?
                    <CircularProgress /> :
                    <ReportForm
                        expenseCategories={props.expenseCategories}
                        nfeItemCategories={props.nfeItemCategories}
                        banks={props.banks}
                        form={form}
                        onSubmit={form.handleSubmit((requestData) => relatoriosEvents.search({ requestData, setChartConfig, setLoading, setTableData }))}
                        onClear={() => {
                            form.reset()
                            setTableData([])
                            setChartConfig({
                                data: [],
                                labels: []
                            })
                        }}
                    />
            }
            <ReportChart chartConfig={chartConfig} />

            <h1 className="w-fit m-auto">Total: R$ {sumExpenses.toFixed(2)}</h1>

            <NfeTable nfeitems={tableData} />

        </div>
    )
}

//#endregion

//#region Interfaces / Types 

interface ReportBodyProps {
    expenseCategories: expensecategories[]
    nfeItemCategories: nfeitemcategories[]
    banks: banks[]
    month: number
    year: number
}

//#endregion