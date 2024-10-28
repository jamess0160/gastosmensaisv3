import { CreateTypes } from "@/database/CreateTypes"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import { Delete, Edit } from "@mui/icons-material"
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { banks } from "@prisma/client"
import axios from "axios"
import { Dispatch, useState } from "react"
import { UseFormReset, UseFormSetValue, useForm } from "react-hook-form"
import { Input } from "../../components/fields/input"
import { openConfirmDialog } from "../../components/ConfirmDialog/confirmDialog"

const cellClass = "text-white text-nowrap text-clip w-1/5 text-center"

//#region Functions 

export function BanksPage(props: BanksPageProps) {
    let { register, handleSubmit, formState, setValue, reset } = useForm<CreateTypes.CreateBank>()

    let [loading, setLoading] = useState(false)
    let [edit, setEdit] = useState(false)

    let tableData = clientUtilsUseCases.handleTableData(props.banks)

    const handleSubmitForm = (data: CreateTypes.CreateBank) => {
        submitForm({
            edit: edit,
            setEdit: setEdit,
            setLoading: setLoading,
            reset: reset,
            bankData: data,
            forceReload: props.forceReload
        })
    }

    return (
        <div>
            {
                loading ?
                    <div>
                        Carregando...
                    </div>
                    : <form className="mb-10 mt-10 w-1/2 flex flex-col gap-y-5" onSubmit={handleSubmit(handleSubmitForm)}>

                        {Object.values(formState.errors).length !== 0 && (
                            <div className="mb-5 text-red-600">
                                Por favor, preencha todos os campos do formulário!
                            </div>
                        )}

                        <Input label="Nome" inputProps={{ ...register("Name", { required: true }), type: "text" }} />
                        <div className="flex flex-col">
                            Cor
                            <input className="h-10" type="color" {...register("Color", { required: true })} />
                        </div>
                        <Button className="w-1/3" variant="contained" type="submit" >{edit ? "Editar Banco" : "Cadastrar Banco"}</Button>
                    </form>
            }

            <TableContainer className="bg-default !bg-opacity-50">
                <Table>
                    <TableBody>{generateTableRows(tableData, setEdit, setValue, props.forceReload)}</TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

async function submitForm(params: SubmitFormParams) {
    params.setLoading(true)

    if (params.edit) {
        await axios.put("/api/banks", params.bankData)
        params.setEdit(false)
    } else {
        await axios.post("/api/banks", params.bankData)
    }

    await params.forceReload()
    params.reset()
    params.setLoading(false)
}

function generateTableRows(tableData: (banks | false)[], setEdit: Dispatch<boolean>, setValue: UseFormSetValue<CreateTypes.CreateBank>, forceReload: () => Promise<void>) {
    return tableData.map((item) => {

        if (!item) {
            return <EmptyRow />
        }

        const eventEdit = () => {
            setEdit(true)
            setValue("Name", item.Name)
            setValue("Color", item.Color || "")
            setValue("IdBank", item.IdBank)
        }

        return (
            <TableRow>
                <TableCell className={cellClass}> {item.Name} </TableCell>
                <TableCell className={cellClass}> {item.Color} </TableCell>
                <TableCell className={cellClass}>
                    <div className="flex items-center justify-end mr-10">
                        <IconButton className="py-0" onClick={eventEdit}>
                            <Edit color="primary" />
                        </IconButton>
                        <IconButton className="py-0" onClick={deleteBank.bind(null, item.IdBank, forceReload)}>
                            <Delete color="primary" />
                        </IconButton>
                    </div>
                </TableCell>
            </TableRow>
        )
    })
}

function EmptyRow() {
    return (
        <TableRow>
            <TableCell className="text-slate-800 text-opacity-50 select-none">1</TableCell>
            <TableCell className="text-slate-800 text-opacity-50 select-none">1</TableCell>
            <TableCell className="text-slate-800 text-opacity-50 select-none">1</TableCell>
        </TableRow>
    )
}

async function deleteBank(IdBank: number, forceReload: () => Promise<void>) {
    let action = await openConfirmDialog("Deseja mesmo deletar esse banco?")

    if (!action) {
        return
    }

    await axios.delete("/api/banks", { params: { IdBank } })
    await forceReload()
}


//#endregion

//#region Interfaces / Types 

interface BanksPageProps {
    banks: banks[]
    forceReload: () => Promise<void>
}

interface SubmitFormParams {
    edit: boolean
    setEdit: Dispatch<boolean>
    setLoading: Dispatch<boolean>
    reset: UseFormReset<CreateTypes.CreateBank>
    bankData: CreateTypes.CreateBank
    forceReload: () => Promise<void>
}

//#endregion