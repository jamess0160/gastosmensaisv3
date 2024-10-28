import { CreateTypes } from "@/database/CreateTypes"
import { expensecategories } from "@prisma/client"
import axios from "axios"
import { Dispatch, useState } from "react"
import { UseFormReset, UseFormSetValue, useForm } from "react-hook-form"
import { openConfirmDialog } from "../../components/ConfirmDialog/confirmDialog"
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { Delete, Edit } from "@mui/icons-material"
import { Input } from "../../components/fields/input"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"

const cellClass = "text-white text-nowrap text-clip w-1/5 text-center"

//#region Functions

export function ExpenseCategoriesPage(props: ExpenseCategoriesPageProps) {
    let { register, handleSubmit, formState, setValue, reset } = useForm<CreateTypes.CreateExpenseCategory>()

    let [loading, setLoading] = useState(false)
    let [edit, setEdit] = useState(false)

    let tableData = clientUtilsUseCases.handleTableData(props.expensecategories)

    const handleSubmitForm = (data: CreateTypes.CreateExpenseCategory) => {
        submitForm({
            edit: edit,
            setEdit: setEdit,
            setLoading: setLoading,
            reset: reset,
            expensecategoryData: data,
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

                        <Input label="Nome" inputProps={{ ...register("Description", { required: true }), type: "text" }} />
                        <Button className="w-1/3" variant="contained" type="submit" >{edit ? "Editar Tipo de gasto" : "Cadastrar Tipo de gasto"}</Button>
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
        await axios.put("/api/expensecategories", params.expensecategoryData)
        params.setEdit(false)
    } else {
        await axios.post("/api/expensecategories", params.expensecategoryData)
    }

    await params.forceReload()
    params.reset()
    params.setLoading(false)
}

function generateTableRows(tableData: (expensecategories | false)[], setEdit: Dispatch<boolean>, setValue: UseFormSetValue<CreateTypes.CreateExpenseCategory>, forceReload: () => Promise<void>) {
    return tableData.map((item) => {

        if (!item) {
            return <EmptyRow />
        }

        const eventEdit = () => {
            setEdit(true)
            setValue("Description", item.Description)
            setValue("IdExpenseCategory", item.IdExpenseCategory)
        }

        return (
            <TableRow>
                <TableCell className={cellClass}> {item.Description} </TableCell>
                <TableCell className={cellClass}>
                    <div className="flex items-center justify-end mr-10">
                        <IconButton className="py-0" onClick={eventEdit}>
                            <Edit color="primary" />
                        </IconButton>
                        <IconButton className="py-0" onClick={deleteExpenseCategory.bind(null, item.IdExpenseCategory, forceReload)}>
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
        </TableRow>
    )
}

async function deleteExpenseCategory(IdExpenseCategory: number, forceReload: () => Promise<void>) {
    let action = await openConfirmDialog("Deseja mesmo deletar esse tipo de gasto?")

    if (!action) {
        return
    }

    await axios.delete("/api/expensecategories", { params: { IdExpenseCategory } })
    await forceReload()
}

//#endregion

//#region Interfaces / Types 

interface SubmitFormParams {
    edit: boolean
    setEdit: Dispatch<boolean>
    setLoading: Dispatch<boolean>
    reset: UseFormReset<CreateTypes.CreateExpenseCategory>
    expensecategoryData: CreateTypes.CreateExpenseCategory
    forceReload: () => Promise<void>
}

//#endregion

interface ExpenseCategoriesPageProps {
    expensecategories: expensecategories[]
    forceReload: () => Promise<void>
}