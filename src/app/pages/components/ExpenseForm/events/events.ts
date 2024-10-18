import { UtilTypes } from "@/database/UtilTypes";
import axios from "axios";
import { ChangeEvent, Dispatch } from "react";
import { UseFormReset } from "react-hook-form";

class ExpenseFormEvents {

    async onSubmit(data: UtilTypes.CreateExpense, setFormState: Dispatch<boolean>, resetForm: UseFormReset<UtilTypes.CreateExpense>, setIsLoading: Dispatch<boolean>, edit: boolean) {
        console.log("passou")
        // setIsLoading(true)

        // if (edit) {
        //     await this.editExpense(data)
        //     setFormState(false)
        // } else {
        //     await this.createExpense(data)
        // }

        // setIsLoading(false)
        // resetForm()
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