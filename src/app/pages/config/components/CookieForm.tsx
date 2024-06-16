'use client'

import { useForm } from "react-hook-form-mui"
import { configEvents } from "../events/events"
import { useRef, useState } from "react"
import { UtilTypes } from "@/database/UtilTypes"
import { CircularProgress } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import { Select } from "../../components/fields/selelct"
import { Input } from "../../components/fields/input"

export default function CookieForm(props: CookieFormProps) {
    let [isLoading, setLoading] = useState(false)

    let { register, handleSubmit } = useForm<UtilTypes.CookiesPostBody>({ defaultValues: { month: props.month, year: props.year } })

    let submitForm = handleSubmit((data) => configEvents.onCookieChange(data, setLoading))

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <div className="rounded-lg w-1/3 max-md:w-11/12 flex justify-center" style={{ backgroundColor: "#1E1F22" }} >
            <form
                className="w-10/12 flex flex-col gap-5 p-5 pt-10 items-center"
                onSubmit={submitForm}
                onChange={submitForm}
            >

                <Select
                    label="Mês"
                    selectItems={clientUtilsUseCases.months.map((item, index) => ({ key: index, text: item }))}
                    selectProps={{ ...register("month") }}
                />

                <Input label="Ano" inputProps={{ ...register("year") }} />
            </form>
        </div>
    )
}

interface CookieFormProps {
    month: string
    year: string
}