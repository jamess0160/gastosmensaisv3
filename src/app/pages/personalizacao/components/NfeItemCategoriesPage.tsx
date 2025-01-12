import { CreateTypes } from "@/database/CreateTypes"
import { nfeitemcategories } from "@prisma/client"
import axios from "axios"
import { Dispatch, useState } from "react"
import { UseFormReset, UseFormSetValue, useForm } from "react-hook-form"
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { Delete, Edit } from "@mui/icons-material"
import { Input } from "../../components/fields/input"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { dialogs } from "../../components/Dialogs/dialogs"

const cellClass = "text-white text-nowrap text-clip w-1/5 text-center"

//#region Functions

export function NfeItemCategoriesPage(props: NfeItemCategoriesPageProps) {
    let { register, handleSubmit, formState, setValue, reset } = useForm<CreateTypes.CreateNfeItemCategory>()

    let [loading, setLoading] = useState(false)
    let [edit, setEdit] = useState(false)

    let tableData = clientUtilsUseCases.handleTableData(props.nfeItemCategories)

    const handleSubmitForm = (data: CreateTypes.CreateNfeItemCategory) => {
        submitForm({
            edit: edit,
            setEdit: setEdit,
            setLoading: setLoading,
            reset: reset,
            nfeitemcategoryData: data,
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
                    : <form
                        autoComplete="off"
                        className="lg:w-1/3 flex flex-col max-md:items-center gap-5 p-5"
                        onSubmit={handleSubmit(handleSubmitForm)}
                    >

                        {Object.values(formState.errors).length !== 0 && (
                            <div className="mb-5 text-red-600">
                                Por favor, preencha todos os campos do formulário!
                            </div>
                        )}

                        <Input label="Nome" inputProps={{ ...register("Description", { required: true }), type: "text" }} />
                        <div className="flex flex-col w-10/12">
                            Cor
                            <input className="h-10 w-full" type="color" {...register("Color", { required: true })} />
                        </div>

                        <Button className="w-10/12" variant="contained" type="submit" >{edit ? "Editar Categoria de nota" : "Cadastrar Categoria de nota"}</Button>
                    </form>
            }

            <TableContainer className="bg-default-light">
                <Table>
                    <TableBody>{generateTableRows(tableData, setEdit, setValue, props.forceReload)}</TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

async function submitForm(params: SubmitFormParams) {
    params.setLoading(true)
    try {

        if (params.edit) {
            await axios.put("/api/nfeitemcategories", params.nfeitemcategoryData)
            params.setEdit(false)
        } else {
            await axios.post("/api/nfeitemcategories", params.nfeitemcategoryData)
        }

        await params.forceReload()
        params.reset()
    } catch (error) {
        clientUtilsUseCases.HandleError.run(error, "Ocorreu um erro ao enviar!")
    } finally {
        params.setLoading(false)

    }
}

function generateTableRows(tableData: (nfeitemcategories | false)[], setEdit: Dispatch<boolean>, setValue: UseFormSetValue<CreateTypes.CreateNfeItemCategory>, forceReload: () => Promise<void>) {
    return tableData.map((item, index) => {

        if (!item) {
            return <EmptyRow key={index} />
        }

        const eventEdit = () => {
            setEdit(true)
            setValue("Description", item.Description)
            setValue("IdNfeItemCategory", item.IdNfeItemCategory)
        }

        return (
            <TableRow key={index} >
                <TableCell className={cellClass}> {item.Description} </TableCell>
                <TableCell className={cellClass}> {item.Color} </TableCell>
                <TableCell className={cellClass}>
                    <div className="flex items-center justify-end lg:mr-10">
                        <IconButton className="py-0" onClick={eventEdit}>
                            <Edit color="primary" />
                        </IconButton>
                        <IconButton className="py-0" onClick={deleteNfeItemCategory.bind(null, item.IdNfeItemCategory, forceReload)}>
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
            <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
            <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
            <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
        </TableRow>
    )
}

async function deleteNfeItemCategory(IdNfeItemCategory: number, forceReload: () => Promise<void>) {
    let action = await dialogs.Confirm.show("Deseja mesmo deletar essa categoria de nota?")

    if (!action) {
        return
    }

    await axios.delete("/api/nfeitemcategories", { params: { IdNfeItemCategory } })
    await forceReload()
}

//#endregion

//#region Interfaces / Types 

interface SubmitFormParams {
    edit: boolean
    setEdit: Dispatch<boolean>
    setLoading: Dispatch<boolean>
    reset: UseFormReset<CreateTypes.CreateNfeItemCategory>
    nfeitemcategoryData: CreateTypes.CreateNfeItemCategory
    forceReload: () => Promise<void>
}

//#endregion

interface NfeItemCategoriesPageProps {
    nfeItemCategories: nfeitemcategories[]
    forceReload: () => Promise<void>
}