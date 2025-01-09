import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import axios from "axios"
import { Dispatch } from "react"

class NfeTableEvents {
    public async onFormChange(IdNfeItem: number, IdNfeItemCategory: number, setLoading: Dispatch<boolean>) {

        setLoading(true)

        try {
            await axios.post("/api/nfeitem/category", { IdNfeItem, IdNfeItemCategory })
        } catch (error) {
            clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro ao atualizar o item da nota!")
        } finally {
            setLoading(false)
        }
    }
}

export const nfeTableEvents = new NfeTableEvents()