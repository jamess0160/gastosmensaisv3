import { NfeReportData, NfeReportFormData } from "@/app/api/relatorios/controller/sections/POST/generateNfeReports";
import axios from "axios";
import { Dispatch } from "react";

export class RelatoriosEvents {
    async search(params: searchParams) {
        params.setLoading(true)

        let { data } = await axios.post<NfeReportData>("/api/relatorios/notas", params.requestData)

        params.setTableData(data.tableData)
        params.setChartConfig(data.chartData)
        params.setLoading(false)
    }
}

export const relatoriosEvents = new RelatoriosEvents()

interface searchParams {
    requestData: NfeReportFormData
    setTableData: Dispatch<NfeReportData['tableData']>
    setChartConfig: Dispatch<NfeReportData['chartData']>
    setLoading: Dispatch<boolean>
}