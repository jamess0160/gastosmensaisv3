import { CreateTypes } from "@/database/CreateTypes";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import axios from "axios";
import { ChangeEvent, Dispatch } from "react";
import { UseFormReset } from "react-hook-form";

class ExpenseFormEvents {

    async onSubmit(data: CreateTypes.CreateExpense, setFormState: Dispatch<boolean>, resetForm: UseFormReset<CreateTypes.CreateExpense>, setIsLoading: Dispatch<boolean>, edit: boolean, force: () => Promise<void>) {
        setIsLoading(true)
        try {

            if (edit) {
                await this.editExpense(data)
                setFormState(false)
            } else {
                await this.createExpense(data)
            }

            await force()
            resetForm()
        } catch (error) {
            clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro ao salvar o gasto")
            setFormState(false)
        } finally {
            setIsLoading(false)
        }
    }

    private editExpense(data: CreateTypes.CreateExpense) {
        return axios.put("/api/expense", data)
    }

    private createExpense(data: CreateTypes.CreateExpense) {
        return axios.post("/api/expense", data)
    }

    validatePriceInput(event: ChangeEvent) {
        let input = event.target as HTMLInputElement
        let value = input.value

        input.value = value.match(/[\d\.,]*/)?.at(0) || ""
    }

    validateDanfeInput(event: ChangeEvent) {
        let input = event.target as HTMLInputElement
        let value = input.value

        input.value = value.replace(/\s/g, "")
    }
}

export const expenseFormEventsEvents = new ExpenseFormEvents()