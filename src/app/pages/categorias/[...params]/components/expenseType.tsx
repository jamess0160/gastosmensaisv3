import { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm"
import { Categories, CategoryData } from "@/useCases/Expenses/GetCategoriesData"
import { ExpenseTable } from "@/app/pages/components/ExpenseTable/ExpenseTable"

//#region Functions 

export default function ExpenseType(props: PageProps) {

    return (
        <div hidden={!props.selected}>
            <ExpenseTable data={props.CategorieData.tableData} ExpenseFormData={props.ExpenseFormData} month={props.month} year={props.year} type={props.type} />

            <h1 className="w-fit m-auto mt-5 underline">R$ {props.CategorieData.total}</h1>
        </div>
    )
}

//#endregion

//#region Interfaces / Types 

interface PageProps {
    CategorieData: CategoryData
    ExpenseFormData: FieldsData
    month: number
    year: number
    selected: boolean
    type: Categories
}

export type CategoryTableData = PageProps['CategorieData']['tableData'][0]

//#endregion