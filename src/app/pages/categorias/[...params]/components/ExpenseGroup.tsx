import { Categories, CategoryData } from "@/useCases/Expenses/GetCategoriesData";
import { Dispatch, useState } from "react";
import ExpenseType from "./expenseType";
import { FieldsData } from "@/app/pages/components/ExpenseForm/ExpenseForm";

export default function ExpenseGroup(props: ExpenseGroupProps) {

    let firstCategorie = props.CategoryData.at(0)

    if (!firstCategorie) throw new Error("Sem categorias")

    let defaultExpenseType = location.hash ? parseInt(location.hash.replace("#Category", "")) : firstCategorie.IdExpenseCategory

    let [selectedCategory, setSelectedCategory] = useState(defaultExpenseType)

    return (
        <div>
            <div className="flex flex-col">

                <Tabs CategoryData={props.CategoryData} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

                {props.CategoryData.map((item, index) => {

                    let isSelected = selectedCategory === item.IdExpenseCategory

                    return (
                        <div hidden={!isSelected} className="p-3" style={{ background: "linear-gradient(0deg, rgba(49, 51, 56, 0.9) 66.87%, rgba(49, 51, 56, 0.9) 100%)" }} key={index}>
                            <ExpenseType
                                CategorieData={item}
                                ExpenseFormData={props.ExpenseFormData}
                                month={props.month} year={props.year}
                                selected={isSelected}
                                type={props.type}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Tabs({ CategoryData, setSelectedCategory, selectedCategory }: TabsProps) {
    return (
        <div className="flex flex-row w-fit max-md:w-full max-md:flex-col max-md:items-center max-md:!bg-none rounded-t-xl" style={{ background: "linear-gradient(0deg, rgba(49, 51, 56, 0.9) 66.87%, rgba(49, 51, 56, 0.9) 100%)" }}>
            {CategoryData.map((item, index) => {

                function onInteract() {
                    setSelectedCategory(item.IdExpenseCategory)
                }

                let classes = "m-0 px-3 hover:bg-default p-2 max-md:!bg-transparent"

                if (index === 0) {
                    classes += " rounded-tl-xl"
                }

                if (index == CategoryData.length - 1) {
                    classes += " rounded-tr-xl"
                }

                if (selectedCategory === item.IdExpenseCategory) {
                    classes += " bg-default max-md:underline max-md:text-fundoVerde"
                }

                return (
                    <h1
                        key={index}
                        onClick={onInteract}
                        onFocus={onInteract}
                        id={`Category${item.IdExpenseCategory.toString()}`}
                        className={classes}
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
}

interface TabsProps {
    CategoryData: CategoryData[]
    setSelectedCategory: Dispatch<number>
    selectedCategory: number
}