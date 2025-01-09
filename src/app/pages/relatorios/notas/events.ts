import { NfeReportData, NfeReportFormData } from "@/app/api/relatorios/controller/sections/POST/generateNfeReports";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import axios from "axios";
import { Dispatch } from "react";
import { dialogs } from "../../components/Dialogs/dialogs";

export class RelatoriosEvents {
    async search(params: searchParams) {
        try {
            params.setLoading(true)

            let result = this.isFormValid(params.requestData)

            if (result === false) {
                return
            }

            let { data } = await axios.post<NfeReportData>("/api/relatorios/notas", params.requestData)

            params.setTableData(data.tableData)
            params.setChartConfig(data.chartData)
        } catch (error) {
            clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro ao buscar o relatório de notas!")
        } finally {
            params.setLoading(false)
        }
    }

    private isFormValid(requestData: searchParams['requestData']) {

        if (!requestData.interval) {
            dialogs.Error.show("Por favor, preencha o campo de intervalo para continuar!", "Formulário inválido!")
            return false
        }

        if (requestData.date) {
            return true
        }

        if (requestData.dateStart && requestData.dateEnd) {
            return true
        }

        dialogs.Error.show("Por favor, preencha algum dos campos de data para continuar!", "Formulário inválido!")
        return false
    }
}

export const relatoriosEvents = new RelatoriosEvents()

interface searchParams {
    requestData: NfeReportFormData
    setTableData: Dispatch<NfeReportData['tableData']>
    setChartConfig: Dispatch<NfeReportData['chartData']>
    setLoading: Dispatch<boolean>
}