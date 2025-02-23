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

const defaultChart = { labels: [""], data: [] }

export function ReportBody(props: ReportBodyProps) {

    let form = useForm<NfeReportFormData>({ defaultValues: { interval: "semana" } })

    let [chartConfig, setChartConfig] = useState<NfeReportData['chartData']>(defaultChart)
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
                            form.setValue("date", undefined)
                            form.setValue("dateStart", undefined)
                            form.setValue("dateEnd", undefined)
                            form.setValue("description", undefined)
                            form.setValue("IdNfeItemCategory", undefined)
                            form.setValue("IdBank", undefined)
                            setTableData([])
                            setChartConfig(defaultChart)
                        }}
                    />
            }
            <ReportChart chartConfig={chartConfig} />

            <h1 className="w-fit m-auto">Total: R$ {sumExpenses.toFixed(2)}</h1>

            <NfeTable nfeitems={tableData} enableEdit={false} />

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