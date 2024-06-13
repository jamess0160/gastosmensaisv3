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

    let cellClass = "text-white text-nowrap text-clip"

    return (
        <TableRow className={props.item.splitCount ? "bg-default" : ""}>
            <TableCell className={cellClass + " w-1/6"} align="left"> {getFirstCollumnData(props)} </TableCell>
            <TableCell className={cellClass + " w-1/3"} align="center"> {props.item.Description} </TableCell>
            <TableCell className={cellClass} align="center"> {`R$ ${clientUtilsUseCases.GetExpensePrice(props.item).toFixed(2)}`} </TableCell>
            <LastCell item={props.item} ExpenseFormData={props.ExpenseFormData} />
        </TableRow>
    )
}

function LastCell(props: Omit<TableRowProps, "month" | "year">) {

    if (props.item.splitCount && props.item.splitCount > 0) {
        return (
            <TableCell className="text-white">
                <div className="flex items-center justify-end">
                    <div className="w-1/2 flex justify-between">
                        <div className="leading-6 min-w-fit w-2/5">{props.item.obs}</div>
                        -
                        <div className="leading-6 min-w-fit w-2/5">{props.item.banks.Name}</div>
                    </div>
                </div>
            </TableCell>
        )
    }

    return (
        <TableCell className="text-white">
            <div className="flex items-center justify-end">
                <ChangeActiveState item={props.item} />
                <EditItem item={props.item} ExpenseFormData={props.ExpenseFormData} />
                <DeleteItem item={props.item} />
            </div>
        </TableCell>
    )
}

function getFirstCollumnData({ item, month, year }: TableRowProps) {

    if (clientUtilsUseCases.GetExpenseType.isDefault(item)) {
        return item.child.ExpenseDate ? new Date(item.child.ExpenseDate).toLocaleDateString("pt-br") : ""
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

    return <Checkbox className="py-0" checked={item.Active === null ? false : item.Active} onChange={(event) => categoriasEvents.onActiveChange(event, item, setLodingState)} />
}

function DeleteItem({ item }: ComponentsProps) {
    let [loadingState, setLodingState] = useState(false)

    if (loadingState) {
        return <CircularProgress size="1rem" />
    }

    return (
        <IconButton className="py-0" onClick={() => categoriasEvents.onDeleteItemClick(item, setLodingState)}>
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