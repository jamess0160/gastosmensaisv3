import { useState } from "react"
import styles from '../ExpenseForm.module.css'
import { UseFormRegister, UseFormSetValue } from "react-hook-form"
import { FieldsData } from "../ExpenseForm"
import { expenseFormEventsEvents } from "../events/events"
import { Input } from "../../fields/input"
import { Select } from "../../fields/selelct"
import moment from "moment"
import { CreateTypes } from "@/database/CreateTypes"

//#region Functions 

export default function FormFields({ register, setValue, fieldsData, editItem }: FormFieldsProps) {
    let [checkboxState, setCheckboxState] = useState<checkboxState>(editItem?.Type || null)

    function onCheckBoxChange(newValue: CreateTypes.CreateExpense['Type']) {
        setValue("Type", newValue)
        setCheckboxState(newValue)
    }

    return (
        <>
            <Input label="Data de Registro" inputProps={{ ...register("EntryDate", { required: true }), type: "month", defaultValue: moment().format("YYYY-MM") }} />
            <Input label="Descrição" inputProps={{ ...register("Description", { required: true }), type: "text" }} />

            <div className={`${styles.campo} ${styles.checkParent}`}>
                <div className={styles.checkGroup}>
                    <div>
                        <input checked={checkboxState === "Default"} onChange={() => onCheckBoxChange("Default")} type="checkbox"></input>
                        Padrão
                    </div>
                    <div>
                        <input checked={checkboxState === "Installment"} onChange={() => onCheckBoxChange("Installment")} type="checkbox"></input>
                        Parcela
                    </div>
                    <div>
                        <input checked={checkboxState === "Fixed"} onChange={() => onCheckBoxChange("Fixed")} type="checkbox"></input>
                        Fixo
                    </div>
                </div>
            </div>

            {getCheckBoxStateField(checkboxState, register)}

            <Input label="Valor" inputProps={{ ...register("Price", { required: true }), onChange: expenseFormEventsEvents.validatePriceInput }} />
            <Select
                label="Destino"
                selectProps={{ ...register("IdDestiny", { required: true }) }}
                selectItems={fieldsData.Destinys.map((item) => ({ key: item.IdDestiny, text: item.Name }))}
            />
            <Select
                label="Tipo de gasto"
                selectProps={{ ...register("IdExpenseCategory", { required: true }) }}
                selectItems={fieldsData.ExpenseCategories.map((item) => ({ key: item.IdExpenseCategory, text: item.Description }))}
            />
            <Select
                label="Banco"
                selectProps={{ ...register("IdBank", { required: true }) }}
                selectItems={fieldsData.Banks.map((item) => ({ key: item.IdBank, text: item.Name }))}
            />
        </>
    )
}

function getCheckBoxStateField(checkboxState: checkboxState, register: FormFieldsProps['register']) {
    if (checkboxState === "Default") {
        return <Input label="Data do Gasto" inputProps={{ ...register("ExpenseDate"), type: "date" }} />
    }

    if (checkboxState === "Installment") {
        return (
            <>
                <Input label="Parcela atual" inputProps={{ ...register("CurrentInstallment", { required: true }), type: "number" }} />
                <Input label="Parcelas totais" inputProps={{ ...register("MaxInstallment", { required: true }), type: "number" }} />
            </>
        )
    }
}

//#endregion

//#region Interfaces / Types 

interface FormFieldsProps {
    register: UseFormRegister<CreateTypes.CreateExpense>
    setValue: UseFormSetValue<CreateTypes.CreateExpense>
    fieldsData: FieldsData
    editItem?: Partial<CreateTypes.CreateExpense>
}

type checkboxState = "Default" | "Installment" | "Fixed" | null

//#endregion