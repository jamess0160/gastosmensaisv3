'use client';

import { Button, CircularProgress } from "@mui/material";
import { Input } from "../components/fields/input";
import { useForm } from "react-hook-form";
import { UtilTypes } from "@/database/UtilTypes";
import { LoginController } from "./controller/controller";
import { useEffect, useState } from "react";

export default function Page() {

    const controller = new LoginController()

    useEffect(() => {
        controller.init()
    }, [controller])

    let form = useForm<UtilTypes.LoginData>()
    let [loading, setLoading] = useState(false)

    return (
        <div className="w-full h-screen flex flex-col justify-center max-md:justify-start max-md:pt-20 items-center">
            <h1>Gastos Mensais</h1>
            <form
                autoComplete="off"
                onSubmit={form.handleSubmit((data) => controller.login(data, setLoading))}
                className="w-1/4 max-md:w-2/3 h-fit p-10 border rounded-lg flex flex-col gap-5"
                style={{ backgroundColor: "#31464f" }}
            >
                <Input label="Usuário" inputProps={{ ...form.register("username", { required: true }) }} />
                <Input label="Senha" inputProps={{ ...form.register("password", { required: true }), type: "password" }} />

                {Object.values(form.formState.errors).length > 0 && (
                    <div className="text-red-600 text-center font-bold">
                        Por favor, preencha todos os campos para continuar!
                    </div>
                )}

                <div className="w-full flex justify-center ">
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Button className="w-1/3 border border-solid" type="submit">Enviar</Button>
                    )}
                </div>
            </form>
        </div>
    )
}

