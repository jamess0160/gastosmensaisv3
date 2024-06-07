'use client';
import axios from "axios";
import styles from './AddExpense.module.css'
import { Add } from '@mui/icons-material'
import { UtilTypes } from "@/database/UtilTypes";
import { Button, Dialog, DialogTitle, IconButton } from "@mui/material";
import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";
import { UseFormRegister, UseFormSetValue, useForm } from "react-hook-form";
import { banks, destinys, expensecategories } from "@prisma/client";

//#region Functions

export default function AddExpense({ fieldsData }: AddExpenseProps) {
    let [openForm, setOpenForm] = useState(false)

    return (
        <div className={styles.Footer}>
            <Form formState={openForm} setFormState={setOpenForm} fieldsData={fieldsData} />
            <IconButton className={styles.Button} color="primary" onClick={() => setOpenForm(!openForm)} >
                <Add fontSize="large" />
            </IconButton>
        </div>
    )
}

function Form({ formState, setFormState, fieldsData }: FormProps) {
    let { register, handleSubmit, setValue } = useForm<UtilTypes.CreateExpense>()

    return (
        <Dialog open={formState}  >
            <div className={styles.dialog}>
                <DialogTitle color={"white"}>Novo gasto</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit.bind(null, setFormState))} className={styles.form}>
                    <FormFields register={register} setValue={setValue} fieldsData={fieldsData} />
                    <FormButtons setFormState={setFormState} />
                </form>
            </div>
        </Dialog>
    )
}

async function onSubmit(setFormState: FormProps['setFormState'], data: UtilTypes.CreateExpense) {
    await axios.post("/api/createExpense", data)
    setFormState(false)
}

function FormFields({ register, setValue, fieldsData }: FormFieldsProps) {
    let [checkboxState, setCheckboxState] = useState("")

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
                <input {...register("Price")} onChange={validatePriceInput}></input>
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

function validatePriceInput(event: ChangeEvent) {
    let input = event.target as HTMLInputElement
    let value = input.value

    input.value = value.match(/[\d\.,]*/)?.at(0) || ""
}

function FormButtons({ setFormState }: FormButtonProps) {
    return (
        <div className={styles.botoes}>
            <Button onClick={() => setFormState(false)} className={`${styles.botao} ${styles.cancelar}`} >Fechar</Button>
            <Button type="submit" className={`${styles.botao} ${styles.cadastrar}`} >Cadastrar</Button>
        </div>
    )
}

//#endregion

//#region Interfaces / Types

interface AddExpenseProps {
    fieldsData: FieldsData
}

interface FieldsData {
    Destinys: destinys[]
    ExpenseCategories: expensecategories[]
    Banks: banks[]
}

interface FormProps {
    formState: boolean
    setFormState: Dispatch<SetStateAction<boolean>>
    fieldsData: FieldsData
}

interface FormFieldsProps {
    register: UseFormRegister<UtilTypes.CreateExpense>
    setValue: UseFormSetValue<UtilTypes.CreateExpense>
    fieldsData: FieldsData
}

interface FormButtonProps {
    setFormState: Dispatch<SetStateAction<boolean>>
}

//#endregion