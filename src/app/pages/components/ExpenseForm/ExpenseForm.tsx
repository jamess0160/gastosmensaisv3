import { Dispatch, useState } from "react"
import { Button, CircularProgress, Dialog, DialogTitle } from "@mui/material"
import styles from './ExpenseForm.module.css'
import { useForm } from "react-hook-form"
import { expenseFormEventsEvents } from "./events/events"
import FormFields from "./components/FormFields"
import FormButtons from "./components/FormButtons"
import { banks, destinys, expensecategories } from "@prisma/client";
import { CreateTypes } from "@/database/CreateTypes"

//#region Functions 

export default function ExpenseForm(props: FormProps) {
    let form = useForm<CreateTypes.CreateExpense>({
        defaultValues: {
            Type: "Default",
            IdsDestinys: [],
            ...props.editItem
        }
    })

    let [isLoading, setIsLoading] = useState(false)

    if (isLoading) {
        return <CircularProgress />
    }

    let dialogContent = (
        <div className={styles.dialog}>
            <DialogTitle color={"white"}>{props.editItem ? "Editar gasto" : "Novo gasto"}</DialogTitle>
            <form
                autoComplete="off"
                onSubmit={form.handleSubmit((data) => expenseFormEventsEvents.onSubmit(data, props.setFormState, form.reset, setIsLoading, Boolean(props.editItem), props.force))}
                className={styles.form}
            >
                {Object.values(form.formState.errors).length > 0 && (
                    <div className="mb-5 text-red-600 text-center">
                        Por favor, preencha todos os campos para continuar!
                    </div>
                )}
                <FormFields form={form} fieldsData={props.fieldsData} editItem={props.editItem} month={props.month} year={props.year} />
                <FormButtons setFormState={props.setFormState} edit={Boolean(props.editItem)} />
            </form>
        </div>
    )

    let invalidData = validateFieldsData(props.fieldsData)

    if (invalidData.valid === false) {
        dialogContent = (
            <div className={styles.dialog + " p-5 flex flex-col items-center"}>
                <div className="text-center text-white mb-4">{invalidData.msg}</div>
                <Button className="w-1/3 border border-solid" onClick={() => props.setFormState(false)} >Fechar</Button>
            </div>
        )
    }

    return (
        <Dialog open={props.formState}  >
            {dialogContent}
        </Dialog>
    )
}

function validateFieldsData(fieldsData: FieldsData) {

    if (fieldsData.Banks.length === 0) {
        return {
            valid: false,
            msg: "Você ainda não fez o cadastro dos bancos! Faça na tela de personalização!"
        }
    }

    if (fieldsData.Destinys.length === 0) {
        return {
            valid: false,
            msg: "Você ainda não fez o cadastro de destinos! Faça na tela de personalização!"
        }
    }

    if (fieldsData.ExpenseCategories.length === 0) {
        return {
            valid: false,
            msg: "Você ainda não fez o cadastro de tipos de gastos! Faça na tela de personalização!"
        }
    }

    return { valid: true }
}

//#endregion

//#region Interfaces / Types 

export interface FormProps {
    formState: boolean
    setFormState: Dispatch<boolean>
    fieldsData: FieldsData
    month: number
    year: number
    editItem?: Partial<CreateTypes.CreateExpense>
    force: () => Promise<void>
}

export interface FieldsData {
    Destinys: destinys[]
    ExpenseCategories: expensecategories[]
    Banks: banks[]
}

//#endregion