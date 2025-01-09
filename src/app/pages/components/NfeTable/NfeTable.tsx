import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { defaultCellClass } from "../ExpenseTable/CategoryTableRow/CategoryTableRow";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import { nfeitemcategories, nfeitems } from "@prisma/client";
import { Select } from "../fields/select";
import { UseFormReturn, useForm } from "react-hook-form";
import { usePooling } from "@/app/utils/usePooling";
import { Dispatch, useEffect, useRef, useState } from "react";
import { nfeTableEvents } from "./events";
import { UtilTypes } from "@/database/UtilTypes";

export function NfeTable(props: Props) {
    let tableNfeitems = clientUtilsUseCases.handleTableData(props.nfeitems)

    let [loading, setLoading] = useState(false)

    let { form, data } = getFormAndData(props.nfeitems)

    let tableRows = generateTableRows(tableNfeitems, props, form, data)

    configFormEffect(form, setLoading)

    if (loading) {
        <CircularProgress />
    }

    return (
        <TableContainer className="bg-default-light">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className={defaultCellClass + " bg-default"}>Descrição</TableCell>
                        <TableCell className={defaultCellClass + " bg-default"}>Quantidade</TableCell>
                        <TableCell className={defaultCellClass + " bg-default"}>UN</TableCell>
                        <TableCell className={defaultCellClass + " bg-default"}>Categoria</TableCell>
                        <TableCell className={defaultCellClass + " bg-default"}>Valor Unitário</TableCell>
                        <TableCell className={defaultCellClass + " bg-default"}>Valor Total</TableCell>
                    </TableRow>
                    {tableRows}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function getFormAndData(nfeitems: nfeitems[]) {

    let form = useForm<Record<string, string>>({
        defaultValues: nfeitems.reduce((old, item) => {

            old[item.IdNfeItem.toString()] = item.IdNfeItemCategory?.toString() || ""

            return old
        }, {} as Record<string, string>),
    })

    let { data } = usePooling<nfeitemcategories[]>("/api/nfeitemcategories", 10000000000000, { defaultValue: [] })

    return { form, data }
}

function generateTableRows(nfeitems: Array<UtilTypes.FullNfeItem | false>, props: Props, form: Form, data: undefined | nfeitemcategories[]) {

    return nfeitems.map((item, index) => {

        if (!item) {
            return (
                <TableRow key={index}>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                    <TableCell className="text-default-light text-opacity-50 select-none">1</TableCell>
                </TableRow>
            )
        }

        return (
            <TableRow key={index}>
                <TableCell className={defaultCellClass}> {item.Description} </TableCell>
                <TableCell className={defaultCellClass}> {item.Quantity} </TableCell>
                <TableCell className={defaultCellClass}> {item.UN} </TableCell>
                {props.enableEdit ? (
                    <TableCell className={defaultCellClass}>
                        <Select
                            form={form}
                            formProp={item.IdNfeItem.toString()}
                            label=""
                            selectItems={data?.map((item) => ({ key: item.IdNfeItemCategory.toString(), text: item.Description })) || []}
                        />
                    </TableCell>
                ) : (
                    <TableCell className={defaultCellClass}> {item.nfeitemcategories?.Description || "Sem Categoria"} </TableCell>
                )}
                <TableCell className={defaultCellClass}> R$ {item.UnityValue} </TableCell>
                <TableCell className={defaultCellClass}> R$ {item.TotalValue} </TableCell>
            </TableRow>
        )
    })
}

function configFormEffect(form: Form, setLoading: Dispatch<boolean>) {
    let previousValues = useRef(form.getValues());

    let fields = form.watch()

    useEffect(() => {
        let changedFields = Object.keys(fields).filter(key => fields[key] !== previousValues.current[key]);

        if (changedFields) {
            changedFields.forEach((key) => {
                nfeTableEvents.onFormChange(Number(key), Number(fields[key]), setLoading)
            })
        }

        previousValues.current = fields;

    }, [fields])
}

type Form = UseFormReturn<Record<string, string>, any, Record<string, string>>

interface Props {
    nfeitems: UtilTypes.FullNfeItem[]
    enableEdit: boolean
}