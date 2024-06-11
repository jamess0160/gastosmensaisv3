'use client'

import { UtilTypes } from "@/database/UtilTypes";
import { Button, Dialog, DialogContent, DialogTitle, Input, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { destinys } from "@prisma/client";
import { Dispatch, useState } from "react";
import { UseFormSetValue, useForm } from "react-hook-form";
import { configEvents } from "../events/events";
import styles from '../Config.module.css'

export default function CashInflowForm(props: CashInflowFormProps) {
    let { register, handleSubmit, setValue } = useForm<UtilTypes.CreateCashInflow>({ defaultValues: props.editItem })

    let [selectValue, setSelectValue] = useState(props.editItem?.IdCashInflow?.toString())

    let SelectItems = props.destinys.map((item) => <MenuItem key={item.IdDestiny} value={item.IdDestiny} >{item.Name}</MenuItem>)

    return (
        <Dialog open={props.open}>
            <div className={styles.dialog}>
                <DialogTitle>{props.editItem ? "Editar entrada" : "Nova entrada"}</DialogTitle>

                <DialogContent className="w-96">
                    <form className="flex flex-col gap-5 p-5" onSubmit={handleSubmit((data) => configEvents.onSubmitForm(data, Boolean(props.editItem), props.setLoading))}>
                        <InputLabel className="text-white">Destino</InputLabel>
                        <Select className="text-white" value={selectValue} onChange={onSelectChange.bind(null, setSelectValue, setValue)}>{SelectItems}</Select>

                        <InputLabel className="text-white">Descrição</InputLabel>
                        <Input className="text-white" {...register("Description")} />

                        <InputLabel className="text-white">Valor</InputLabel>
                        <Input className="text-white" type="number" {...register("Value")} />

                        <div className="w-full flex justify-around">
                            <Button className="w-1/3 border border-solid" onClick={() => onCancel(props)}>Cancelar</Button>
                            <Button className="w-1/3" type="submit" variant="contained" >{props.editItem ? "Editar" : "Enviar"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </div>
        </Dialog >
    )
}

function onCancel(props: CashInflowFormProps) {
    props.setOpen(false)
    props.setLoading(false)
}

function onSelectChange(setSelectValue: Dispatch<string | undefined>, setValue: UseFormSetValue<UtilTypes.CreateCashInflow>, data: SelectChangeEvent<string>) {
    setSelectValue(data.target.value)
    setValue("IdDestiny", data.target.value)
}

interface CashInflowFormProps {
    open: boolean
    destinys: destinys[]
    setOpen: Dispatch<boolean>
    setLoading: Dispatch<boolean>
    editItem?: UtilTypes.CreateCashInflow
}