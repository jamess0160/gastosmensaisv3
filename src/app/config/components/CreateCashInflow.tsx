'use client';

import { Button, CircularProgress } from "@mui/material";
import { destinys } from "@prisma/client";
import { useState } from "react";
import CashInflowForm from "./CashInflowForm";
import { configEvents } from "../events/events";

export const defaultMsg = "Clonar Entradas anteriores"

export default function CreateCashInflow(props: CashInflowFormProps) {
    let [open, setOpen] = useState(false)
    let [isLoading, setLoading] = useState(false)
    let [msg, setMsg] = useState(defaultMsg)

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <>
            <div className="w-full flex justify-center md:gap-14 max-md:flex-col max-md:items-center">
                <Button className="w-1/4 max-md:w-11/12 text-black my-5" variant="contained" onClick={() => setOpen(true)}>Adicionar Entrada</Button>
                <Button className="w-1/4 max-md:w-11/12 text-black my-5" variant="contained" style={msg === defaultMsg ? {} : { backgroundColor: "green" }} onClick={() => configEvents.cloneCashEntries(setLoading, setMsg)}>{msg}</Button>
            </div>
            <CashInflowForm destinys={props.destinys} open={open} setLoading={setLoading} setOpen={setOpen} />
        </>
    )
}

interface CashInflowFormProps {
    destinys: destinys[]
}