import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild"
import CategoryTableRow from "./CategoryTableRow/CategoryTableRow"
import { Table, TableBody, TableContainer } from "@mui/material"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"
import { EmptyRow } from "./CategoryTableRow/EmptyRow"
import { FieldsData } from "../ExpenseForm/ExpenseForm"
import { Categories } from "@/useCases/Expenses/GetCategoriesData"

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
        />
    })

    return (
        <TableContainer className="bg-default !bg-opacity-50">
            <Table>
                <TableBody>{tableRows}</TableBody>
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
}