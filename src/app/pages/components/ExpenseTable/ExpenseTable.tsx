import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild"
import CategoryTableRow, { defaultCellClass } from "./CategoryTableRow/CategoryTableRow"
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases"
import { EmptyRow } from "./CategoryTableRow/EmptyRow"
import { FieldsData } from "../ExpenseForm/ExpenseForm"
import { Categories } from "@/useCases/Expenses/sections/GetCategoriesData"

export function ExpenseTable(props: ExpenseTableProps) {
    let tableData = clientUtilsUseCases.handleTableData(props.data)

    let tableRows = tableData.map((item, index) => {
        if (!item) {
            return <EmptyRow key={index} />
        }

        return <CategoryTableRow
            key={index}
            item={item}
            ExpenseFormData={props.ExpenseFormData}
            month={props.month}
            year={props.year}
            type={props.type}
            force={props.force}
        />
    })

    return (
        <TableContainer className="bg-default-light">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className={defaultCellClass + " bg-default"}>Data</TableCell>
                        <TableCell className={defaultCellClass + " bg-default"}>Descrição</TableCell>
                        <TableCell className={defaultCellClass + " bg-default"}>Preço</TableCell>
                        <TableCell className={defaultCellClass + " bg-default"}>{props.type ? props.type === "banco" ? "Destino" : "Banco" : "Destino / Banco"}</TableCell>
                        <TableCell className={defaultCellClass + " bg-default"}></TableCell>
                    </TableRow>
                    {tableRows}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

interface ExpenseTableProps {
    data: FullBaseExpenseChild[]
    ExpenseFormData?: FieldsData
    month?: number
    year?: number
    type?: Categories
    force: () => Promise<void>
}