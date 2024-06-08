import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { CategorieData } from "../page"
import { utilsUseCases } from "@/useCases/Utils/UtilsUseCases"

//#region Functions 

export default function ExpenseType(props: PageProps) {

    let data = handleCategorieData(props.CategorieData.tableData)

    let tableRows = data.map((item, index) => item ? <CategorieTableRow key={item.IdBaseExpense} item={item} /> : <EmptyRow key={index} />)

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

function handleCategorieData(data: Array<CategorieTableData | false>) {
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
        </TableRow>
    )
}

function CategorieTableRow({ item }: { item: CategorieTableData }) {
    return (
        <TableRow>
            <TableCell className="text-white">{getFirstCollumnData(item)}</TableCell>
            <TableCell className="text-white">{item.Description}</TableCell>
            <TableCell className="text-white">{`R$ ${utilsUseCases.GetExpensePrice(item).toFixed(2)}`}</TableCell>
            {/* <TableCell className="text-white">{"item.carbs"}</TableCell>
            <TableCell className="text-white">{"item.protein"}</TableCell> */}
        </TableRow>
    )
}

function getFirstCollumnData(expense: CategorieTableData) {

    if (utilsUseCases.GetExpenseType.isDefault(expense)) {
        return expense.child.ExpenseDate?.toLocaleDateString("pt-br")
    }

    if (utilsUseCases.GetExpenseType.isFixed(expense)) {
        return "Fixo"
    }

    if (utilsUseCases.GetExpenseType.isInstallment(expense)) {
        let current = utilsUseCases.parseLeftZero(expense.child.CurrentInstallment)
        let max = utilsUseCases.parseLeftZero(expense.child.MaxInstallment)
        return `${current}/${max}`
    }

    return expense.EntryDate?.toLocaleDateString("pt-br")
}

//#endregion

//#region Interfaces / Types 

interface PageProps {
    id: string
    CategorieData: CategorieData
}

type CategorieTableData = PageProps['CategorieData']['tableData'][0]

//#endregion