'use client'

import { useForm } from "react-hook-form-mui"
import { configEvents } from "../events/events"
import { useState } from "react"
import { UtilTypes } from "@/database/UtilTypes"
import { Button, CircularProgress } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import { Select } from "../../components/fields/selelct"
import { Input } from "../../components/fields/input"

export default function CookieForm(props: CookieFormProps) {
    let [isLoading, setLoading] = useState(false)

    let { register, handleSubmit } = useForm<UtilTypes.CookiesPostBody>({ defaultValues: { month: (parseInt(props.month) + 1).toString(), year: props.year } })

    let submitForm = handleSubmit((data) => {
        data.month = (parseInt(data.month) - 1).toString()
        configEvents.onCookieChange(data, setLoading)
    })

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <div className="rounded-lg w-1/3 max-md:w-11/12 flex justify-center" style={{ backgroundColor: "#1E1F22" }} >
            <form
                className="w-10/12 flex flex-col gap-5 p-5 pt-10 items-center"
                onSubmit={submitForm}
            >

                <Select
                    label="Mês"
                    selectItems={clientUtilsUseCases.months.map((item, index) => ({ key: index + 1, text: item }))}
                    selectProps={{ ...register("month") }}
                />

                <Input label="Ano" inputProps={{ ...register("year") }} />

                <Button className="w-1/2 max-md:w-11/12 text-black my-5" variant="contained" type="submit">Enviar</Button>
            </form>
        </div>
    )
}

interface CookieFormProps {
    month: string
    year: string
}