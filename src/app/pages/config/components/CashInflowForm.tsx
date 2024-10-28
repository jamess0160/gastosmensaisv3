'use client'
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { destinys } from "@prisma/client";
import { Dispatch } from "react";
import { useForm } from "react-hook-form";
import { configEvents } from "../events/events";
import styles from '../Config.module.css'
import { CreateTypes } from "@/database/CreateTypes";

export default function CashInflowForm(props: CashInflowFormProps) {
    let { register, handleSubmit } = useForm<CreateTypes.CreateCashInflow>({ defaultValues: props.editItem })

    let SelectItems = props.destinys.map((item) => <option key={item.IdDestiny} value={item.IdDestiny} >{item.Name}</option>)

    return (
        <Dialog open={props.open} fullScreen={true}>
            <div className={styles.dialog + " max-md:!m-0"}>
                <div className={styles.bgcolor + " w-96 max-md:w-full max-md:h-screen rounded-xl"}>
                    <DialogTitle align="center">{props.editItem ? "Editar entrada" : "Nova entrada"}</DialogTitle>

                    <DialogContent>
                        <form className="flex flex-col gap-5 p-5 items-center" onSubmit={handleSubmit((data) => configEvents.onSubmitForm(data, Boolean(props.editItem), props.setLoading))}>
                            <div className={styles.campo} >
                                <legend>Destino</legend>
                                <select {...register("IdDestiny")}>
                                    {SelectItems}
                                </select>
                            </div>

                            <div className={styles.campo} >
                                <legend>Descrição</legend>
                                <input {...register("Description")}></input>
                            </div>

                            <div className={styles.campo} >
                                <legend>Valor</legend>
                                <input {...register("Value")}></input>
                            </div>

                            <div className="w-full flex justify-around">
                                <Button className="w-1/3 border border-solid" onClick={() => onCancel(props)}>Cancelar</Button>
                                <Button className="w-1/3" type="submit" variant="contained" >{props.editItem ? "Editar" : "Enviar"}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </div>
            </div>
        </Dialog >
    )
}

function onCancel(props: CashInflowFormProps) {
    props.setOpen(false)
    props.setLoading(false)
}

interface CashInflowFormProps {
    open: boolean
    destinys: destinys[]
    setOpen: Dispatch<boolean>
    setLoading: Dispatch<boolean>
    editItem?: CreateTypes.CreateCashInflow
}