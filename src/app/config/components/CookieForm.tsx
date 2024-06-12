'use client'

import { UseFormSetValue, useForm } from "react-hook-form-mui"
import { configEvents } from "../events/events"
import { Dispatch, useState } from "react"
import { UtilTypes } from "@/database/UtilTypes"
import { Button, CircularProgress, Input, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"

export default function CookieForm(props: CookieFormProps) {
    let [isLoading, setLoading] = useState(false)
    let [selectValue, setSelectValue] = useState(props.month)

    let { register, handleSubmit, setValue } = useForm<UtilTypes.CookiesPostBody>({ defaultValues: { month: props.month, year: props.year } })

    let monthsSelectItems = clientUtilsUseCases.months.map((item, index) => <MenuItem key={index} value={index.toString()}>{item}</MenuItem>)

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <form className="rounded-lg bg-slate-800 bg-opacity-50 w-1/2 max-md:w-11/12 flex flex-col gap-5 p-5" onSubmit={handleSubmit((data) => configEvents.onCookieChange(data, setLoading))}>
            <InputLabel className="text-white">Mês</InputLabel >
            <Select className="text-white" value={selectValue} onChange={onSelectChange.bind(null, setSelectValue, setValue)} >{monthsSelectItems}</Select>

            <InputLabel className="text-white">Ano</InputLabel >
            <Input className="text-white" type="number" {...register("year")} />

            <Button type="submit" variant="contained" className="w-1/3 m-auto">Enviar</Button>
        </form>
    )
}

function onSelectChange(setSelectValue: Dispatch<string>, setValue: UseFormSetValue<UtilTypes.CookiesPostBody>, data: SelectChangeEvent<string>) {
    setSelectValue(data.target.value)
    setValue("month", data.target.value)
}

interface CookieFormProps {
    month: string
    year: string
}