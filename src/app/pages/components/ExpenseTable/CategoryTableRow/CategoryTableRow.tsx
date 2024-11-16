'use client';

import { Checkbox, CircularProgress, IconButton, TableCell, TableRow } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
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

    return (
        <TableRow className={props.item.splitCount ? "bg-default" : ""}>
            <TableCell className={cellClass}> {getFirstCollumnData(props)} </TableCell>
            <TableCell className={cellClass}> {props.item.Description} </TableCell>
            <TableCell className={cellClass}> {`R$ ${clientUtilsUseCases.GetExpensePrice(props.item).toFixed(2)}`} </TableCell>
            <TableCell className={cellClass}> {getDestinyBankColumnData(props.item, props.type)} </TableCell>
            <LastCell item={props.item} ExpenseFormData={props.ExpenseFormData} force={props.force} />
        </TableRow>
    )
}

function LastCell(props: Omit<TableRowProps, "month" | "year" | "type">) {

    if (!props.ExpenseFormData) {
        return <EmptyCell />
    }

    if (props.item.splitCount && props.item.splitCount > 0) {
        return (
            <TableCell className={cellClass}>
                <div className="flex items-center justify-end leading-6 text-nowrap">
                    {props.item.obs}
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

function getDestinyBankColumnData(item: FullBaseExpenseChild, type?: Categories) {
    if (!type) {
        return `${item.destinys?.Name} - ${item.banks?.Name}`
    }

    if (type === "banco") {
        return item.destinys?.Name
    }

    if (type === "pessoal") {
        return item.banks?.Name
    }

    return ""
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