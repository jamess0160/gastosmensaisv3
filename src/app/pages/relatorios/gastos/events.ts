import { RelatorioData, RelatorioFormData } from "@/app/api/relatorios/controller/sections/POST/generateReports";
import axios from "axios";
import { Dispatch } from "react";

export class RelatoriosEvents {
    async search(params: searchParams) {
        params.setLoading(true)

        let { data } = await axios.post<RelatorioData>("/api/relatorios/gastos", params.requestData)

        params.setTableData(data.tableData)
        params.setChartConfig(data.chartData)
        params.setLoading(false)
    }
}

export const relatoriosEvents = new RelatoriosEvents()

interface searchParams {
    requestData: RelatorioFormData
    setTableData: Dispatch<RelatorioData['tableData']>
    setChartConfig: Dispatch<RelatorioData['chartData']>
    setLoading: Dispatch<boolean>
}