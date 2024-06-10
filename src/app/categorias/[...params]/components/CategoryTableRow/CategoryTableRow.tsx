'use client';

import { Checkbox, CircularProgress, IconButton, TableCell, TableRow } from "@mui/material"
import { CategoryTableData as CategoryTableData } from "../expenseType"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import { Delete } from "@mui/icons-material"
import { categoriasEvents } from "../../events/events"
import { useState } from "react";
import { FieldsData } from "@/app/components/ExpenseForm/ExpenseForm";
import EditItem from "./components/EditItem";

//#region Functions 

export default function CategoryTableRow({ item, ExpenseFormData }: TableRowProps) {

    return (
        <TableRow>
            <TableCell className="text-white w-1/6" align="left"> {getFirstCollumnData(item)} </TableCell>
            <TableCell className="text-white w-1/3" align="center"> {item.Description} </TableCell>
            <TableCell className="text-white" align="center"> {`R$ ${clientUtilsUseCases.GetExpensePrice(item).toFixed(2)}`} </TableCell>
            <TableCell className="text-white">
                <div className="flex items-center justify-end">

                    <ChangeActiveState item={item} />
                    <EditItem item={item} ExpenseFormData={ExpenseFormData} />
                    <DeleteItem item={item} />

                </div>
            </TableCell>
        </TableRow>
    )
}

function getFirstCollumnData(expense: CategoryTableData) {

    if (clientUtilsUseCases.GetExpenseType.isDefault(expense)) {
        return expense.child.ExpenseDate?.toLocaleDateString("pt-br")
    }

    if (clientUtilsUseCases.GetExpenseType.isFixed(expense)) {
        return "Fixo"
    }

    if (clientUtilsUseCases.GetExpenseType.isInstallment(expense)) {
        let current = clientUtilsUseCases.parseLeftZero(expense.child.CurrentInstallment)
        let max = clientUtilsUseCases.parseLeftZero(expense.child.MaxInstallment)
        return `${current}/${max}`
    }

    return expense.EntryDate?.toLocaleDateString("pt-br")
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

type ComponentsProps = Omit<TableRowProps, "ExpenseFormData">

interface TableRowProps {
    item: CategoryTableData
    ExpenseFormData: FieldsData
}

//#endregion