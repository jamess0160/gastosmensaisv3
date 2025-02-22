import { Categories, CategoryData } from "@/useCases/Expenses/sections/GetCategoriesData";
import { Dispatch, useState } from "react";
import ExpenseType from "./expenseType";
import { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";

export default function ExpenseGroup(props: ExpenseGroupProps) {

    let firstCategorie = props.CategoryData.at(0)

    if (!firstCategorie) throw new Error("Sem categorias")

    let defaultExpenseType = location.hash ? parseInt(location.hash.replace("#Category", "")) : 0

    let [selectedCategory, setSelectedCategory] = useState(defaultExpenseType)

    let isFirstSelected = selectedCategory === 0

    let allCategorysData = clientUtilsUseCases.SortExpenses.run(props.CategoryData.flatMap((item) => item.tableData))
    let allCategorysTotal = props.CategoryData.reduce((old, item) => old + item.total, 0)

    return (
        <div>
            <div className="flex flex-col">

                <Tabs CategoryData={props.CategoryData} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

                <div hidden={!isFirstSelected} className="p-3" style={{ background: "linear-gradient(0deg, rgba(49, 51, 56, 0.9) 66.87%, rgba(49, 51, 56, 0.9) 100%)" }}>
                    <ExpenseType
                        tableData={allCategorysData}
                        total={parseFloat(allCategorysTotal.toFixed(2))}
                        ExpenseFormData={props.ExpenseFormData}
                        month={props.month} year={props.year}
                        selected={isFirstSelected}
                        type={props.type}
                        force={props.force}
                    />
                </div>

                {props.CategoryData.map((item, index) => {

                    let isSelected = selectedCategory === item.IdExpenseCategory

                    return (
                        <div hidden={!isSelected} className="p-3" style={{ background: "linear-gradient(0deg, rgba(49, 51, 56, 0.9) 66.87%, rgba(49, 51, 56, 0.9) 100%)" }} key={index}>
                            <ExpenseType
                                tableData={item.tableData}
                                total={item.total}
                                ExpenseFormData={props.ExpenseFormData}
                                month={props.month} year={props.year}
                                selected={isSelected}
                                type={props.type}
                                force={props.force}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Tabs({ CategoryData, setSelectedCategory, selectedCategory }: TabsProps) {

    function onInteract(IdExpenseCategory: number) {
        setSelectedCategory(IdExpenseCategory)
    }

    let classes = "m-0 px-3 hover:bg-default p-2 max-md:!bg-transparent"

    return (
        <div className="flex flex-row w-fit max-md:w-full max-md:flex-col max-md:items-center max-md:!bg-none rounded-t-xl" style={{ background: "linear-gradient(0deg, rgba(49, 51, 56, 0.9) 66.87%, rgba(49, 51, 56, 0.9) 100%)" }}>

            <h1
                onClick={onInteract.bind(null, 0)}
                onFocus={onInteract.bind(null, 0)}
                id={`Category0`}
                className={classes + (selectedCategory === 0 ? " bg-default max-md:underline max-md:text-fundoVerde" : "")}
            >
                Total
            </h1>

            {CategoryData.map((item, index) => {

                let cloneClass = structuredClone(classes)

                if (index === 0) {
                    cloneClass += " rounded-tl-xl"
                }

                if (index == CategoryData.length - 1) {
                    cloneClass += " rounded-tr-xl"
                }

                if (selectedCategory === item.IdExpenseCategory) {
                    cloneClass += " bg-default max-md:underline max-md:text-fundoVerde"
                }

                return (
                    <h1
                        key={index}
                        onClick={onInteract.bind(null, item.IdExpenseCategory)}
                        onFocus={onInteract.bind(null, item.IdExpenseCategory)}
                        id={`Category${item.IdExpenseCategory.toString()}`}
                        className={cloneClass}
                    >
                        {item.name}
                    </h1>
                )
            })}
        </div>
    )
}

interface ExpenseGroupProps {
    CategoryData: CategoryData[]
    ExpenseFormData: FieldsData
    month: number
    year: number
    type: Categories
    force: () => Promise<void>
}

interface TabsProps {
    CategoryData: CategoryData[]
    setSelectedCategory: Dispatch<number>
    selectedCategory: number
}