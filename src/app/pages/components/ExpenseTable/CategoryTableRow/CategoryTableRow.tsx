'use client';

import { Checkbox, CircularProgress, IconButton, TableCell, TableRow } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { Delete, Receipt } from "@mui/icons-material"
import { useState } from "react";
import { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm";
import EditItem from "./components/EditItem";
import moment from "moment";
import { Categories } from "@/useCases/Expenses/sections/GetCategoriesData";
import { FullBaseExpenseChild, NfeExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild";
import { categoriasEvents } from "../events";
import { EmptyCell } from "./EmptyRow";
import { NfePopUp } from "./components/NfePopUp";

//#region Functions 

export const defaultCellClass = "text-white text-nowrap text-clip w-1/5"

export default function CategoryTableRow(props: TableRowProps) {
    let isSplit = props.type === "pessoal" && props.item.expensedestinys.length > 1

    return (
        <TableRow className={isSplit ? "bg-default-mid" : ""}>
            <TableCell className={defaultCellClass}> {getFirstCollumnData(props)} </TableCell>
            <TableCell className={defaultCellClass}> {props.item.Description} </TableCell>
            <TableCell className={defaultCellClass}> {`R$ ${clientUtilsUseCases.GetExpensePrice(props.item, { split: props.type === "pessoal" }).toFixed(2)}`} </TableCell>
            <TableCell className={defaultCellClass} title={getDestinyBankColumnData(props.item, props.type, { full: true })} > {getDestinyBankColumnData(props.item, props.type)} </TableCell>
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
            <TableCell className={defaultCellClass}>
                <div className="flex items-center justify-end leading-6 text-nowrap">
                    {formatDestinys(props.item)}
                </div>
            </TableCell>
        )
    }

    if (props.month === undefined || props.year === undefined) {
        return
    }

    return (
        <TableCell className={defaultCellClass}>
            <div className="flex items-center justify-end">
                {clientUtilsUseCases.GetExpenseType.isNfe(props.item) && <OpenNfePopUp item={props.item} />}
                <ChangeActiveState item={props.item} force={props.force} />
                <EditItem
                    item={props.item}
                    ExpenseFormData={props.ExpenseFormData}
                    month={props.month}
                    year={props.year}
                    force={props.force}
                />
                <DeleteItem item={props.item} force={props.force} />
            </div>
        </TableCell>
    )
}

function getFirstCollumnData({ item, month, year }: TableRowProps) {

    if (clientUtilsUseCases.GetExpenseType.isDefault(item) || clientUtilsUseCases.GetExpenseType.isNfe(item)) {
        return item.child.ExpenseDate ? new Date(item.child.ExpenseDate).toLocaleDateString("pt-br") : ""
    }

    if (clientUtilsUseCases.GetExpenseType.isFixed(item)) {
        return "Fixo"
    }

    if (clientUtilsUseCases.GetExpenseType.isInstallment(item) && month !== undefined && year !== undefined) {

        let monthsDiff = Math.ceil(clientUtilsUseCases.monthAndYearToMoment(month, year).diff(moment(item.child.StartDate), "month", true))

        let current = clientUtilsUseCases.parseLeftZero(item.child.CurrentInstallment + monthsDiff)
        let max = clientUtilsUseCases.parseLeftZero(item.child.MaxInstallment)

        return `${current}/${max}`
    }

    return "ERRO"
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

function OpenNfePopUp({ item }: { item: NfeExpenseChild }) {
    let [popUpOpen, setPopUpOpen] = useState(false)

    return (
        <>
            <IconButton className="py-0" onClick={() => setPopUpOpen(true)}>
                <Receipt color="primary" />
            </IconButton>
            <NfePopUp open={popUpOpen} item={item} setOpen={setPopUpOpen} />
        </>
    )
}

function ChangeActiveState({ item, force }: ComponentsProps) {
    let [loadingState, setLodingState] = useState(false)

    if (loadingState) {
        return <CircularProgress size="1rem" />
    }

    return <Checkbox className="py-0" checked={item.Active === null ? false : item.Active} onChange={(event) => categoriasEvents.onActiveChange(event, item, setLodingState, force)} />
}

function DeleteItem({ item, force }: ComponentsProps) {
    let [loadingState, setLodingState] = useState(false)

    if (loadingState) {
        return <CircularProgress size="1rem" />
    }

    return (
        <IconButton className="py-0" onClick={() => categoriasEvents.onDeleteItemClick(item, setLodingState, force)}>
            <Delete color="primary" />
        </IconButton>
    )
}

//#endregion

//#region Interfaces / Types 

interface ComponentsProps {
    item: FullBaseExpenseChild
    force: () => Promise<void>
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