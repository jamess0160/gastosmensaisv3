import ExpenseForm, { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm"
import { CircularProgress, IconButton } from "@mui/material"
import { Edit } from "@mui/icons-material"
import { useState } from "react"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import moment from "moment"
import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild"
import { CreateTypes } from "@/database/CreateTypes"

export default function EditItem(props: EditItemProps) {
    let [loadingState, setLodingState] = useState(false)

    if (loadingState) {
        let createExpense = generateCreateExpense(props.item)

        return (
            <>
                <CircularProgress size="1rem" />
                <ExpenseForm
                    fieldsData={props.ExpenseFormData}
                    formState={loadingState}
                    setFormState={setLodingState}
                    month={props.month}
                    year={props.year}
                    editItem={createExpense}
                    force={props.force}
                />
            </>
        )
    }

    return (
        <IconButton className="py-0" onClick={() => setLodingState(true)}>
            <Edit color="primary" />
        </IconButton>
    )
}

function generateCreateExpense(item: EditItemProps['item']): Partial<CreateTypes.CreateExpense> {
    let base: Partial<CreateTypes.CreateExpense> = {
        IdBaseExpense: item.IdBaseExpense,
        Description: item.Description,
        EntryDate: item.EntryDate ? moment(item.EntryDate).format("YYYY-MM") : undefined,
        IdBank: item.IdBank?.toString(),
        IdsDestinys: item.expensedestinys.map((item) => item.IdDestiny.toString()),
        IdExpenseCategory: item.IdExpenseCategory?.toString(),
        Price: clientUtilsUseCases.GetExpensePrice(item, { split: false }).toString(),
    }

    if (clientUtilsUseCases.GetExpenseType.isNfe(item)) {
        let defaultData: Partial<CreateTypes.CreateExpense> = {
            Type: "NFE",
            ExpenseDate: item.child.ExpenseDate ? moment(item.child.ExpenseDate).format("YYYY-MM-DD") : undefined,
            DanfeCode: item.child.DanfeCode || undefined,
        }

        return Object.assign(base, defaultData)
    }

    if (clientUtilsUseCases.GetExpenseType.isDefault(item)) {
        let defaultData: Partial<CreateTypes.CreateExpense> = {
            Type: "Default",
            ExpenseDate: item.child.ExpenseDate ? moment(item.child.ExpenseDate).format("YYYY-MM-DD") : undefined,
        }

        return Object.assign(base, defaultData)
    }

    if (clientUtilsUseCases.GetExpenseType.isFixed(item)) {
        let fixedData: Partial<CreateTypes.CreateExpense> = {
            Type: "Fixed",
        }

        return Object.assign(base, fixedData)
    }

    if (clientUtilsUseCases.GetExpenseType.isInstallment(item)) {
        let defaultData: Partial<CreateTypes.CreateExpense> = {
            Type: "Installment",
            CurrentInstallment: item.child.CurrentInstallment.toString(),
            MaxInstallment: item.child.MaxInstallment.toString(),
        }

        return Object.assign(base, defaultData)
    }

    return base
}

interface EditItemProps {
    item: FullBaseExpenseChild
    ExpenseFormData: FieldsData
    month: number
    year: number
    force: () => Promise<void>
}