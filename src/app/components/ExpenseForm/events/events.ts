import { UtilTypes } from "@/database/UtilTypes";
import axios from "axios";
import { ChangeEvent } from "react";
import { FormProps } from "../ExpenseForm";

class ExpenseFormEvents {

    async onSubmit(setFormState: FormProps['setFormState'], edit: boolean, data: UtilTypes.CreateExpense) {

        if (edit) {
            await this.editExpense(data)
        } else {
            await this.createExpense(data)
        }

        setFormState(false)
    }

    private editExpense(data: UtilTypes.CreateExpense) {
        return axios.put("/api/expense", data)
    }

    private createExpense(data: UtilTypes.CreateExpense) {
        return axios.post("/api/expense", data)
    }

    validatePriceInput(event: ChangeEvent) {
        let input = event.target as HTMLInputElement
        let value = input.value

        input.value = value.match(/[\d\.,]*/)?.at(0) || ""
    }
}

export const expenseFormEventsEvents = new ExpenseFormEvents()