import { Dispatch } from "react"
import { FieldsData } from "../ExpenseForm"
import { Dialog, DialogTitle } from "@mui/material"
import FormFields from "./FormFields"
import styles from '../ExpenseForm.module.css'
import { useForm } from "react-hook-form"
import { UtilTypes } from "@/database/UtilTypes"
import FormButtons from "./FormButtons"
import { expenseFormEventsEvents } from "../events/events"

//#region Functions 

export default function Form({ formState, setFormState, fieldsData }: FormProps) {
    let { register, handleSubmit, setValue } = useForm<UtilTypes.CreateExpense>()

    return (
        <Dialog open={formState}  >
            <div className={styles.dialog}>
                <DialogTitle color={"white"}>Novo gasto</DialogTitle>
                <form onSubmit={handleSubmit(expenseFormEventsEvents.onSubmit.bind(null, setFormState))} className={styles.form}>
                    <FormFields register={register} setValue={setValue} fieldsData={fieldsData} />
                    <FormButtons setFormState={setFormState} />
                </form>
            </div>
        </Dialog>
    )
}

//#endregion

//#region Interfaces / Types 

export interface FormProps {
    formState: boolean
    setFormState: Dispatch<boolean>
    fieldsData: FieldsData
}

//#endregion