import { Dispatch, useState } from "react"
import { CircularProgress, Dialog, DialogTitle } from "@mui/material"
import styles from './ExpenseForm.module.css'
import { useForm } from "react-hook-form"
import { UtilTypes } from "@/database/UtilTypes"
import { expenseFormEventsEvents } from "./events/events"
import FormFields from "./components/FormFields"
import FormButtons from "./components/FormButtons"
import { banks, destinys, expensecategories } from "@prisma/client";

//#region Functions 

export default function ExpenseForm(props: FormProps) {
    let { register, handleSubmit, setValue, reset } = useForm<UtilTypes.CreateExpense>({ defaultValues: props.editItem })
    let [isLoading, setIsLoading] = useState(false)

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <Dialog open={props.formState}  >
            <div className={styles.dialog}>
                <DialogTitle color={"white"}>{props.editItem ? "Editar gasto" : "Novo gasto"}</DialogTitle>
                <form
                    onSubmit={handleSubmit((data) => expenseFormEventsEvents.onSubmit(data, props.setFormState, reset, setIsLoading, Boolean(props.editItem)))}
                    className={styles.form}
                >
                    <FormFields register={register} setValue={setValue} fieldsData={props.fieldsData} editItem={props.editItem} />
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