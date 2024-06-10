import { UtilTypes } from "@/database/UtilTypes"
import { useState } from "react"
import styles from '../ExpenseForm.module.css'
import { UseFormRegister, UseFormSetValue } from "react-hook-form"
import { FieldsData } from "../ExpenseForm"
import { expenseFormEventsEvents } from "../events/events"

//#region Functions 

export default function FormFields({ register, setValue, fieldsData, editItem }: FormFieldsProps) {
    let [checkboxState, setCheckboxState] = useState(editItem?.Type || "")

    console.log({ checkboxState, editItem })

    function onCheckBoxChange(newValue: UtilTypes.CreateExpense['Type']) {
        setValue("Type", newValue)
        setCheckboxState(newValue)
    }

    return (
        <>
            <div className={styles.campo}>
                <legend>Data de Registro</legend>
                <input {...register("EntryDate")} type="date"></input>
            </div>
            <div className={styles.campo}>
                <legend>Descrição</legend>
                <input  {...register("Description")} type="text"></input>
            </div>
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
            {
                checkboxState === "Default" && <div className={styles.campo}>
                    <legend>Data do Gasto</legend>
                    <input {...register("ExpenseDate")} type="date"></input>
                </div>
            }
            {
                checkboxState === "Installment" && <>
                    <div className={styles.campo}>
                        <legend>Parcela atual</legend>
                        <input {...register("CurrentInstallment")} type="number"></input>
                    </div>
                    <div className={styles.campo}>
                        <legend>Parcelas totais</legend>
                        <input {...register("MaxInstallment")} type="number"></input>
                    </div>
                </>
            }
            <div className={styles.campo} >
                <legend>Valor</legend>
                <input {...register("Price")} onChange={expenseFormEventsEvents.validatePriceInput}></input>
            </div>
            <div className={styles.campo} >
                <legend>Destino</legend>
                <select {...register("IdDestiny")}>
                    {fieldsData.Destinys.map((item) => <option value={item.IdDestiny} key={item.IdDestiny}>{item.Name}</option>)}
                </select>
            </div>
            <div className={styles.campo} >
                <legend>Tipo de gasto</legend>
                <select {...register("IdExpenseCategory")}>
                    {fieldsData.ExpenseCategories.map((item) => <option value={item.IdExpenseCategory} key={item.IdExpenseCategory}>{item.Description}</option>)}
                </select>
            </div>
            <div className={styles.campo} >
                <legend>Banco</legend>
                <select {...register("IdBank")}>
                    {fieldsData.Banks.map((item) => <option value={item.IdBank} key={item.IdBank}>{item.Name}</option>)}
                </select>
            </div>
        </>
    )
}

//#endregion

//#region Interfaces / Types 

interface FormFieldsProps {
    register: UseFormRegister<UtilTypes.CreateExpense>
    setValue: UseFormSetValue<UtilTypes.CreateExpense>
    fieldsData: FieldsData
    editItem?: Partial<UtilTypes.CreateExpense>
}

//#endregion