import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { CategoryData } from "../page"
import { FieldsData } from "@/app/components/ExpenseForm/ExpenseForm"
import CategoryTableRow from "./CategoryTableRow/CategoryTableRow"

//#region Functions 

export default function ExpenseType(props: PageProps) {

    let data = handleCategoryData(props.CategorieData.tableData)

    let tableRows = data.map((item, index) => item ? <CategoryTableRow key={item.IdBaseExpense} item={item} ExpenseFormData={props.ExpenseFormData} /> : <EmptyRow key={index} />)

    return (
        <>
            <h1 id={props.id} className="m-0 mb-5">{props.CategorieData.name}</h1>

            <TableContainer className="bg-slate-800 bg-opacity-50">
                <Table>
                    <TableBody>{tableRows}</TableBody>
                </Table>
            </TableContainer>

            <h1 className="w-fit m-auto mt-5 underline">R$ {props.CategorieData.total}</h1>
        </>
    )
}

const minRowCount = 10

function handleCategoryData(data: Array<CategoryTableData | false>) {
    if (data.length < minRowCount) {
        let count = minRowCount - data.length
        for (let i = 0; i < count; i++) {
            data.push(false)
        }
    }

    return data
}

function EmptyRow() {
    let classes = "text-slate-800 text-opacity-50 select-none"
    return (
        <TableRow>
            <TableCell className={classes}>1</TableCell>
            <TableCell className={classes}>1</TableCell>
            <TableCell className={classes}>1</TableCell>
            <TableCell className={classes}>1</TableCell>
        </TableRow>
    )
}

//#endregion

//#region Interfaces / Types 

interface PageProps {
    id: string
    CategorieData: CategoryData
    ExpenseFormData: FieldsData
}

export type CategoryTableData = PageProps['CategorieData']['tableData'][0]

//#endregion