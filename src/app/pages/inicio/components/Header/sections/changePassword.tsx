import { Input } from "@/app/pages/components/fields/input"
import { UtilTypes } from "@/database/UtilTypes"
import { Button, CircularProgress, Dialog, DialogTitle } from "@mui/material"
import { Dispatch, useState } from "react"
import { useForm } from "react-hook-form"
import { changePasswordEvents } from "./events"

export function ChangePassword(props: ComponentParams) {

    let form = useForm<UtilTypes.UserChangePassword>()
    let [loading, setLoading] = useState(false)

    return (
        <Dialog open={props.open} PaperProps={{
            className: "max-md:m-0 max-md:w-full"
        }} >
            <div className={"w-96 max-md:w-full p-5 pt-0 bg-default box-border"}>

                <DialogTitle color={"white"}>{"Trocar senha"}</DialogTitle>

                <form
                    className={"flex flex-col gap-5 max-w-full"}
                    onSubmit={form.handleSubmit((data) => {
                        return changePasswordEvents.submit(data, {
                            setLoading,
                            setOpen: props.setOpen
                        })
                    })}
                >

                    {Object.values(form.formState.errors).length > 0 && (
                        <div className="mb-5 text-red-600 text-center">
                            Por favor, preencha todos os campos para continuar!
                        </div>
                    )}

                    <Input inputProps={{ ...form.register("current", { required: true }), type: "password" }} label="Senha atual" />
                    <Input inputProps={{ ...form.register("new", { required: true }), type: "password" }} label="Nova senha" />
                    <Input inputProps={{ ...form.register("confirmNew", { required: true }), type: "password" }} label="Confirmação de senha" />

                    <div className={"flex flex-row justify-around pt-5 w-full"}>
                        {
                            loading ?
                                <CircularProgress />
                                : <>
                                    <Button className="w-2/5 border border-solid" onClick={() => props.setOpen(false)} >Cancelar</Button>
                                    <Button className="w-2/5" variant="contained" type="submit" >Trocar senha</Button>
                                </>
                        }

                    </div>
                </form>
            </div>
        </Dialog>
    )
}

interface ComponentParams {
    open: boolean
    setOpen: Dispatch<boolean>
}