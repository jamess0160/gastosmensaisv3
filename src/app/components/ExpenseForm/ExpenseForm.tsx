import { Dispatch } from "react"
import { Dialog, DialogTitle } from "@mui/material"
import styles from './ExpenseForm.module.css'
import { useForm } from "react-hook-form"
import { UtilTypes } from "@/database/UtilTypes"
import { expenseFormEventsEvents } from "./events/events"
import FormFields from "./components/FormFields"
import FormButtons from "./components/FormButtons"
import { banks, destinys, expensecategories } from "@prisma/client";

//#region Functions 

export default function ExpenseForm(props: FormProps) {
    let { register, handleSubmit, setValue } = useForm<UtilTypes.CreateExpense>({ defaultValues: props.editItem })

    return (
        <Dialog open={props.formState}  >
            <div className={styles.dialog}>
                <DialogTitle color={"white"}>Novo gasto</DialogTitle>
                <form onSubmit={handleSubmit((data) => expenseFormEventsEvents.onSubmit(props.setFormState, Boolean(props.editItem), data))} className={styles.form}>
                    <FormFields register={register} setValue={setValue} fieldsData={props.fieldsData} />
                    <FormButtons setFormState={props.setFormState} edit={Boolean(props.editItem)} />
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
    editItem?: Partial<UtilTypes.CreateExpense>
}

export interface FieldsData {
    Destinys: destinys[]
    ExpenseCategories: expensecategories[]
    Banks: banks[]
}

//#endregion