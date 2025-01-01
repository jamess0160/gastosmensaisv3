import { Dispatch } from "react";
import axios from "axios";
import { UtilTypes } from "@/database/UtilTypes";
import { CashInflowMY } from "@/useCases/CashInflows/CashInflowsUseCases";
import { defaultMsg } from "../components/CreateCashInflow";
import { CreateTypes } from "@/database/CreateTypes";
import { dialogs } from "../../components/Dialogs/dialogs";

class ConfigEvents {

    async onCookieChange(data: UtilTypes.CookiesPostBody, setLoading: Dispatch<boolean>) {

        setLoading(true)

        await axios.post("/api/cookies", data)

        location.reload()
    }

    async onSubmitForm(data: CreateTypes.CreateCashInflow, edit: boolean, setLoading: Dispatch<boolean>) {
        setLoading(true)

        if (edit) {
            await axios.put("/api/cashInflow", data)
        } else {
            await axios.post("/api/cashInflow", data)
        }

        location.reload()
    }

    async onDeleteItemClick(data: CashInflowMY, setLoading: Dispatch<boolean>) {
        setLoading(true)

        let action = await dialogs.Confirm.show("Você deseja mesmo deletar essa entrada?")

        if (!action) {
            setLoading(false)
            return
        }

        await axios.delete("/api/cashInflow", { params: { IdCashInflow: data.IdCashInflow } })

        location.reload()
    }

    async cloneCashEntries(setLoading: Dispatch<boolean>, setMsg: Dispatch<string>) {
        setLoading(true)

        await axios.post("/api/cashInflow/clone")

        setMsg("Entradas clonadas com sucesso!")

        setTimeout(() => {
            setMsg(defaultMsg)
            location.reload()
        }, 2000);

        setLoading(false)
    }
}

export const configEvents = new ConfigEvents()