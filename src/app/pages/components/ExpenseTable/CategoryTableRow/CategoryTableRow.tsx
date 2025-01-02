'use client';

import { Checkbox, CircularProgress, IconButton, TableCell, TableRow } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { Delete } from "@mui/icons-material"
import { useState } from "react";
import { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm";
import EditItem from "./components/EditItem";
import moment from "moment";
import { Categories } from "@/useCases/Expenses/GetCategoriesData";
import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild";
import { categoriasEvents } from "../events";
import { EmptyCell } from "./EmptyRow";

//#region Functions 

const cellClass = "text-white text-nowrap text-clip w-1/5"

export default function CategoryTableRow(props: TableRowProps) {
    let isSplit = props.type === "pessoal" && props.item.expensedestinys.length > 1

    return (
        <TableRow className={isSplit ? "bg-default" : ""}>
            <TableCell className={cellClass}> {getFirstCollumnData(props)} </TableCell>
            <TableCell className={cellClass}> {props.item.Description} </TableCell>
            <TableCell className={cellClass}> {`R$ ${clientUtilsUseCases.GetExpensePrice(props.item, { split: props.type === "pessoal" }).toFixed(2)}`} </TableCell>
            <TableCell className={cellClass} title={getDestinyBankColumnData(props.item, props.type, { full: true })} > {getDestinyBankColumnData(props.item, props.type)} </TableCell>
            <LastCell {...props} />
        </TableRow>
    )
}

function LastCell(props: TableRowProps) {

    if (!props.ExpenseFormData) {
        return <EmptyCell />
    }

    let splitCount = props.item.expensedestinys.length

    if (props.type === "pessoal" && splitCount && splitCount > 1) {
        return (
            <TableCell className={cellClass}>
                <div className="flex items-center justify-end leading-6 text-nowrap">
                    {formatDestinys(props.item)}
                </div>
            </TableCell>
        )
    }

    return (
        <TableCell className={cellClass}>
            <div className="flex items-center justify-end">
                <ChangeActiveState item={props.item} />
                <EditItem item={props.item} ExpenseFormData={props.ExpenseFormData} force={props.force} />
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

    if (clientUtilsUseCases.GetExpenseType.isInstallment(item) && month !== undefined && year !== undefined) {

        let monthsDiff = Math.floor(moment(item.child.ExpectedDate).diff(clientUtilsUseCases.monthAndYearToMoment(month, year), "month", true))

        let current = clientUtilsUseCases.parseLeftZero(item.child.MaxInstallment - (monthsDiff))
        let max = clientUtilsUseCases.parseLeftZero(item.child.MaxInstallment)
        return `${current}/${max}`
    }

    return moment(item.EntryDate).toDate().toLocaleDateString("pt-br")
}

function getDestinyBankColumnData(item: FullBaseExpenseChild, type?: Categories, options?: { full: boolean }) {
    if (!type) {
        return `${formatDestinys(item, options)} - ${item.banks?.Name}`
    }

    if (type === "banco") {
        return formatDestinys(item, options)
    }

    if (type === "pessoal") {
        return item.banks?.Name
    }

    return ""
}

function formatDestinys(item: FullBaseExpenseChild, options?: { full: boolean }) {
    let destintysNames = item.expensedestinys.map((item) => item.destinys.Name)

    if (destintysNames.length > 3 && options?.full !== true) {
        return destintysNames.slice(0, 2).join(", ") + "..."
    }

    return destintysNames.join(", ")
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
    item: FullBaseExpenseChild
}

interface TableRowProps {
    item: FullBaseExpenseChild
    ExpenseFormData?: FieldsData
    month?: number
    year?: number
    type?: Categories
    force: () => Promise<void>
}

//#endregion