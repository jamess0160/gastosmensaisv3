'use client';

import { Checkbox, CircularProgress, IconButton, TableCell, TableRow } from "@mui/material"
import { CategoryTableData as CategoryTableData } from "../expenseType"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import { Delete } from "@mui/icons-material"
import { categoriasEvents } from "../../events/events"
import { useState } from "react";
import { FieldsData } from "@/app/components/ExpenseForm/ExpenseForm";
import EditItem from "./components/EditItem";
import moment from "moment";

//#region Functions 

export default function CategoryTableRow(props: TableRowProps) {

    return (
        <TableRow>
            <TableCell className="text-white w-1/6" align="left"> {getFirstCollumnData(props)} </TableCell>
            <TableCell className="text-white w-1/3" align="center"> {props.item.Description} </TableCell>
            <TableCell className="text-white" align="center"> {`R$ ${clientUtilsUseCases.GetExpensePrice(props.item).toFixed(2)}`} </TableCell>
            <TableCell className="text-white">
                <div className="flex items-center justify-end">

                    <ChangeActiveState item={props.item} />
                    <EditItem item={props.item} ExpenseFormData={props.ExpenseFormData} />
                    <DeleteItem item={props.item} />

                </div>
            </TableCell>
        </TableRow>
    )
}

function getFirstCollumnData({ item, month, year }: TableRowProps) {

    if (clientUtilsUseCases.GetExpenseType.isDefault(item)) {
        return item.child.ExpenseDate?.toLocaleDateString("pt-br")
    }

    if (clientUtilsUseCases.GetExpenseType.isFixed(item)) {
        return "Fixo"
    }

    if (clientUtilsUseCases.GetExpenseType.isInstallment(item)) {

        let monthsDiff = Math.floor(moment(item.child.ExpectedDate).diff(clientUtilsUseCases.monthAndYearToMoment(month, year), "month", true))

        let current = clientUtilsUseCases.parseLeftZero(item.child.MaxInstallment - (monthsDiff))
        let max = clientUtilsUseCases.parseLeftZero(item.child.MaxInstallment)
        return `${current}/${max}`
    }

    return item.EntryDate?.toLocaleDateString("pt-br")
}

//#endregion

//#region Components

function ChangeActiveState({ item }: ComponentsProps) {
    let [loadingState, setLodingState] = useState(false)

    if (loadingState) {
        return <CircularProgress size="1rem" />
    }

    return <Checkbox checked={item.Active === null ? false : item.Active} onChange={(event) => categoriasEvents.onActiveChange(event, item, setLodingState)} />
}

function DeleteItem({ item }: ComponentsProps) {
    let [loadingState, setLodingState] = useState(false)

    if (loadingState) {
        return <CircularProgress size="1rem" />
    }

    return (
        <IconButton onClick={() => categoriasEvents.onDeleteItemClick(item, setLodingState)}>
            <Delete color="primary" />
        </IconButton>
    )
}

//#endregion

//#region Interfaces / Types 

interface ComponentsProps {
    item: CategoryTableData
}

interface TableRowProps {
    item: CategoryTableData
    ExpenseFormData: FieldsData
    month: number
    year: number
}

//#endregion