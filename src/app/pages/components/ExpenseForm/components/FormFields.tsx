import { useState } from "react"
import styles from '../ExpenseForm.module.css'
import { UseFormReturn } from "react-hook-form"
import { FieldsData } from "../ExpenseForm"
import { expenseFormEventsEvents } from "../events/events"
import { Input } from "../../fields/input"
import { Select } from "../../fields/select"
import moment from "moment"
import { CreateTypes } from "@/database/CreateTypes"

//#region Functions 

export default function FormFields(props: FormFieldsProps) {
    let { form, fieldsData, editItem } = props
    let [checkboxState, setCheckboxState] = useState<checkboxState>(editItem?.Type || null)

    function onCheckBoxChange(newValue: CreateTypes.CreateExpense['Type']) {
        form.setValue("Type", newValue)
        setCheckboxState(newValue)
    }

    return (
        <div className={`${styles.form} !w-10/12`}>
            <Input label="Data de Registro" inputProps={{ ...form.register("EntryDate", { required: true }), type: "month", defaultValue: moment().format("YYYY-MM") }} />
            <Input label="Descrição" inputProps={{ ...form.register("Description", { required: true }), type: "text" }} />

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

            {getCheckBoxStateField(checkboxState, form)}

            <Input label="Valor" inputProps={{ ...form.register("Price", { required: true }), onChange: expenseFormEventsEvents.validatePriceInput }} />
            <Select
                label="Destino"
                form={form}
                formProp="IdsDestinys"
                selectProps={{ multiple: true }}
                selectItems={fieldsData.Destinys.map((item) => ({ key: item.IdDestiny.toString(), text: item.Name }))}
            />
            <Select
                label="Tipo de gasto"
                form={form}
                formProp="IdExpenseCategory"
                selectItems={fieldsData.ExpenseCategories.map((item) => ({ key: item.IdExpenseCategory.toString(), text: item.Description }))}
            />
            <Select
                label="Banco"
                form={form}
                formProp="IdBank"
                selectItems={fieldsData.Banks.map((item) => ({ key: item.IdBank.toString(), text: item.Name }))}
            />
        </div>
    )
}

function getCheckBoxStateField(checkboxState: checkboxState, form: FormFieldsProps['form']) {
    if (checkboxState === "Default") {
        return <Input label="Data do Gasto" inputProps={{ ...form.register("ExpenseDate"), type: "date" }} />
    }

    if (checkboxState === "Installment") {
        return (
            <>
                <Input label="Parcela atual" inputProps={{ ...form.register("CurrentInstallment", { required: true }), type: "number" }} />
                <Input label="Parcelas totais" inputProps={{ ...form.register("MaxInstallment", { required: true }), type: "number" }} />
            </>
        )
    }
}

//#endregion

//#region Interfaces / Types 

interface FormFieldsProps {
    form: UseFormReturn<CreateTypes.CreateExpense, any, CreateTypes.CreateExpense>
    fieldsData: FieldsData
    editItem?: Partial<CreateTypes.CreateExpense>
}

type checkboxState = "Default" | "Installment" | "Fixed" | null

//#endregion