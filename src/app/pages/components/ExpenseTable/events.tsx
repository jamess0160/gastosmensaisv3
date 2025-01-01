import { ChangeEvent, Dispatch } from "react";
import { CategoryTableData } from "../../categorias/[...params]/components/expenseType";
import axios from "axios";
import { dialogs } from "../Dialogs/dialogs";

class CategoriasEvents {
    async onActiveChange(event: ChangeEvent<HTMLInputElement>, item: CategoryTableData, setLodingState: Dispatch<boolean>) {
        setLodingState(true)

        let newActive = event.target.checked

        await axios.put("/api/expense/active", { IdBaseExpense: item.IdBaseExpense, Active: newActive })

        setLodingState(false)
    }

    async onDeleteItemClick(item: CategoryTableData, setLodingState: Dispatch<boolean>) {
        setLodingState(true)

        let action = await dialogs.Confirm.show("Deseja mesmo deletar esse item?")

        if (!action) return setLodingState(false)

        await axios.delete(`/api/expense`, { params: { IdBaseExpense: item.IdBaseExpense } })

        setLodingState(false)
    }
}

export const categoriasEvents = new CategoriasEvents()