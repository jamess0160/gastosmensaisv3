import ExpenseForm, { FieldsData } from "@/app/components/ExpenseForm/ExpenseForm"
import { CategoryTableData } from "../../expenseType"
import { CircularProgress, IconButton } from "@mui/material"
import { Edit } from "@mui/icons-material"
import { useState } from "react"
import { UtilTypes } from "@/database/UtilTypes"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import moment from "moment"

export default function EditItem({ item, ExpenseFormData }: EditItemProps) {
    let [loadingState, setLodingState] = useState(false)

    if (loadingState) {
        let createExpense = generateCreateExpense(item)

        return (
            <>
                <CircularProgress size="1rem" />
                <ExpenseForm fieldsData={ExpenseFormData} formState={loadingState} setFormState={setLodingState} editItem={createExpense} />
            </>
        )
    }

    return (
        <IconButton onClick={() => setLodingState(true)}>
            <Edit color="primary" />
        </IconButton>
    )
}

function generateCreateExpense(item: EditItemProps['item']): Partial<UtilTypes.CreateExpense> {
    let base: Partial<UtilTypes.CreateExpense> = {
        IdBaseExpense: item.IdBaseExpense,
        Description: item.Description,
        EntryDate: item.EntryDate ? moment(item.EntryDate).format("YYYY-MM-DD") : undefined,
        IdBank: item.IdBank.toString(),
        IdDestiny: item.IdDestiny.toString(),
        IdExpenseCategory: item.IdExpenseCategory.toString(),
        Price: clientUtilsUseCases.GetExpensePrice(item).toString(),
    }

    if (clientUtilsUseCases.GetExpenseType.isDefault(item)) {
        let defaultData: Partial<UtilTypes.CreateExpense> = {
            Type: "Default",
            ExpenseDate: item.child.ExpenseDate ? moment(item.child.ExpenseDate).format("YYYY-MM-DD") : undefined,
        }

        return Object.assign(base, defaultData)
    }

    if (clientUtilsUseCases.GetExpenseType.isFixed(item)) {
        let fixedData: Partial<UtilTypes.CreateExpense> = {
            Type: "Fixed",
        }

        return Object.assign(base, fixedData)
    }

    if (clientUtilsUseCases.GetExpenseType.isInstallment(item)) {
        let defaultData: Partial<UtilTypes.CreateExpense> = {
            Type: "Installment",
            CurrentInstallment: item.child.CurrentInstallment.toString(),
            MaxInstallment: item.child.MaxInstallment.toString(),
        }

        return Object.assign(base, defaultData)
    }

    return base
}

interface EditItemProps {
    item: CategoryTableData
    ExpenseFormData: FieldsData
}