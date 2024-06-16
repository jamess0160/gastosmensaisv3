'use client'

import { useForm } from "react-hook-form-mui"
import { configEvents } from "../events/events"
import { useRef, useState } from "react"
import { UtilTypes } from "@/database/UtilTypes"
import { CircularProgress } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import styles from '../Config.module.css'

export default function CookieForm(props: CookieFormProps) {
    let [isLoading, setLoading] = useState(false)

    let { register, handleSubmit } = useForm<UtilTypes.CookiesPostBody>({ defaultValues: { month: props.month, year: props.year } })

    let formRef = useRef<HTMLFormElement>(null)

    let submitForm = handleSubmit((data) => configEvents.onCookieChange(data, setLoading))

    let monthsSelectItems = clientUtilsUseCases.months.map((item, index) => <option key={index} value={index.toString()}>{item}</option>)

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <div className="rounded-lg w-1/3 max-md:w-11/12 flex justify-center" style={{ backgroundColor: "#1E1F22" }} >
            <form
                className="w-10/12 flex flex-col gap-5 p-5 pt-10"
                onSubmit={submitForm}
                ref={formRef}
                onChange={submitForm}
            >

                <div className={styles.campo}>
                    <legend>Mês</legend>
                    <select {...register("month")}>
                        {monthsSelectItems}
                    </select>
                </div>

                <div className={styles.campo}>
                    <legend>Ano</legend>
                    <input {...register("year")}></input>
                </div>

            </form>
        </div>
    )
}

interface CookieFormProps {
    month: string
    year: string
}