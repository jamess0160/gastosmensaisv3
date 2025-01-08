import { ExpenseReportData, ExpenseReportFormData } from "@/app/api/relatorios/controller/sections/POST/generateExpenseReports";
import axios from "axios";
import { Dispatch } from "react";

export class RelatoriosEvents {
    async search(params: searchParams) {
        params.setLoading(true)

        let { data } = await axios.post<ExpenseReportData>("/api/relatorios/gastos", params.requestData)

        params.setTableData(data.tableData)
        params.setChartConfig(data.chartData)
        params.setLoading(false)
    }
}

export const relatoriosEvents = new RelatoriosEvents()

interface searchParams {
    requestData: ExpenseReportFormData
    setTableData: Dispatch<ExpenseReportData['tableData']>
    setChartConfig: Dispatch<ExpenseReportData['chartData']>
    setLoading: Dispatch<boolean>
}