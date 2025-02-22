import { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm"
import { Categories, CategoryData } from "@/useCases/Expenses/sections/GetCategoriesData"
import { ExpenseTable } from "@/app/pages/components/ExpenseTable/ExpenseTable"

//#region Functions 

export default function ExpenseType(props: PageProps) {

    return (
        <div hidden={!props.selected}>
            <ExpenseTable
                data={props.tableData}
                ExpenseFormData={props.ExpenseFormData}
                month={props.month}
                year={props.year}
                type={props.type}
                force={props.force}
            />

            <h1 className="w-fit m-auto mt-5 underline max-md:mb-24">R$ {props.total}</h1>
        </div>
    )
}

//#endregion

//#region Interfaces / Types 

interface PageProps {
    tableData: CategoryTableData[]
    total: number
    ExpenseFormData: FieldsData
    month: number
    year: number
    selected: boolean
    type: Categories
    force: () => Promise<void>
}

export type CategoryTableData = CategoryData['tableData'][0]

//#endregion