'use client'

import { useForm } from "react-hook-form-mui"
import { configEvents } from "../events/events"
import { useState } from "react"
import { Button, CircularProgress, IconButton } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import { Input } from "../../components/fields/input"
import { ArrowBack, ArrowForward } from "@mui/icons-material"
import moment from "moment"

export default function CookieForm(props: CookieFormProps) {
    let [isLoading, setLoading] = useState(false)

    let form = useForm<{ date: string }>({ defaultValues: { date: clientUtilsUseCases.monthAndYearToMoment(parseInt(props.month), parseInt(props.year)).format("YYYY-MM") } })

    const submitForm = form.handleSubmit((data) => {
        let dateMoment = moment(data.date, "YYYY-MM")

        let month = dateMoment.get("month").toString()
        let year = dateMoment.get("year").toString()

        configEvents.onCookieChange({ month, year }, setLoading)
    })

    const add = () => {
        let data = form.getValues()
        let dateMoment = moment(data.date, "YYYY-MM")
        form.setValue("date", dateMoment.add(1, "month").format("YYYY-MM"))
    }

    const subtract = () => {
        let data = form.getValues()
        let dateMoment = moment(data.date, "YYYY-MM")
        form.setValue("date", dateMoment.subtract(1, "month").format("YYYY-MM"))
    }

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <div className="rounded-lg w-1/3 max-md:w-11/12 flex justify-center" style={{ backgroundColor: "#1E1F22" }} >
            <form
                className="w-10/12 flex flex-col gap-5 p-5 pt-10 items-center"
                onSubmit={submitForm}
            >

                <div className="flex flex-row gap-4 w-3/4">
                    <IconButton className="rounded-full p-1 outline outline-1 outline-white" color="primary" onClick={subtract}>
                        <ArrowBack />
                    </IconButton>

                    <Input inputProps={{ ...form.register("date"), type: "month", defaultValue: moment().format("YYYY-MM") }} />

                    <IconButton className="rounded-full p-1 outline outline-1 outline-white" color="primary" onClick={add}>
                        <ArrowForward />
                    </IconButton>
                </div>

                <Button className="w-1/2 max-md:w-11/12 text-black my-5" variant="contained" type="submit">Salvar</Button>
            </form>
        </div>
    )
}

interface CookieFormProps {
    month: string
    year: string
}