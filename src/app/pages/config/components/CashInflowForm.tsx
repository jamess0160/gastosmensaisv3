'use client'
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { destinys } from "@prisma/client";
import { Dispatch } from "react";
import { useForm } from "react-hook-form";
import { configEvents } from "../events/events";
import styles from '../Config.module.css'
import { CreateTypes } from "@/database/CreateTypes";
import { Select } from "../../components/fields/select";
import { Input } from "../../components/fields/input";

export default function CashInflowForm(props: CashInflowFormProps) {
    let form = useForm<CreateTypes.CreateCashInflow>({ defaultValues: props.editItem })

    let SelectItems = props.destinys.map((item) => ({ key: item.IdDestiny.toString(), text: item.Name }))

    return (
        <Dialog open={props.open} fullScreen={true}>
            <div className={styles.dialog + " max-md:!m-0"}>
                <div className={styles.bgcolor + " w-96 max-md:w-full max-md:h-screen rounded-xl"}>
                    <DialogTitle align="center">{props.editItem ? "Editar entrada" : "Nova entrada"}</DialogTitle>

                    <DialogContent>
                        <form className="flex flex-col gap-5 pt-5 items-center" onSubmit={form.handleSubmit((data) => configEvents.onSubmitForm(data, Boolean(props.editItem), props.setLoading))}>
                            <Select
                                form={form}
                                formProp="IdsDestinys"
                                label="Destino"
                                selectItems={SelectItems}
                                selectProps={{ multiple: true }}
                            />

                            <Input label="Descrição" inputProps={{ ...form.register("Description") }} />

                            <Input label="Valor" inputProps={{ ...form.register("Value") }} />

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
    editItem?: Partial<CreateTypes.CreateCashInflow>
}