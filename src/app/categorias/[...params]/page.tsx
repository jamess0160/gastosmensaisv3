import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases"
import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild"
import ExpenseType from "./components/expenseType"
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases"
import { expensecategories } from "@prisma/client"
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases"
import { banksUseCases } from "@/useCases/Banks/BanksUseCases"
import { Container } from "@mui/material"
import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases"
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases"

export default async function Page(props: PageProps) {

    let [type, id] = props.params.params

    let { month, year } = serverUtilsUseCases.getMonthYear()

    let data = await clientUtilsUseCases.resolvePromiseObj({
        categoriesData: getCategoriesData(type, parseInt(id), month, year),
        Banks: banksUseCases.getAll(),
        Destinys: destinysUseCases.getAll(),
        ExpenseCategories: expenseCategoriesUseCases.getAll()
    })

    let ExpenseFormData = {
        Banks: data.Banks,
        Destinys: data.Destinys,
        ExpenseCategories: data.ExpenseCategories
    }

    let parsedType = type === "banco" ? "Banco" : "Pessoal"

    return (
        <Container maxWidth="xl">
            <div className="fixed top-2 right-4">
                <h1 className="min-w-fit m-0 text-center underline" >{`${parsedType} - ${data.categoriesData.name}`}</h1>
            </div>
            <div className="pt-12">
                {data.categoriesData.data.map((item, index) => <ExpenseType id={`Category${item.IdExpenseCategory.toString()}`} key={index} CategorieData={item} ExpenseFormData={ExpenseFormData} month={month} year={year} />)}
            </div>
        </Container>
    )
}

async function getCategoriesData(type: Categories, id: number, month: number, year: number): Promise<ExpenseTypeData> {
    let expenseCategories = await expenseCategoriesUseCases.getAll()

    if (type === "banco") {
        return getBanksData(id, expenseCategories, month, year)
    }

    if (type === "pessoal") {
        return getDestinyData(id, expenseCategories, month, year)
    }

    throw new Error("type não é válido")
}

async function getBanksData(id: number, expenseCategories: expensecategories[], month: number, year: number): Promise<ExpenseTypeData> {
    let bank = await banksUseCases.getFirstBy({ IdBank: id })

    if (!bank) throw new Error("Banco não encontrado!")

    return {
        name: bank.Name,
        data: await Promise.all(expenseCategories.map<Promise<CategoryData>>(async (item) => {
            let categoryData = await baseExpensesUseCases.GetMonthlyBankCategory(month, year, id, item.IdExpenseCategory)

            return handleExpenseData(item, categoryData)
        }))
    }
}

async function getDestinyData(id: number, expenseCategories: expensecategories[], month: number, year: number): Promise<ExpenseTypeData> {
    let destiny = await destinysUseCases.getFirstBy({ IdDestiny: id })

    if (!destiny) throw new Error("Destino não encontrado!")

    return {
        name: destiny.Name,
        data: await Promise.all(expenseCategories.map<Promise<CategoryData>>(async (item) => {
            let categoryData = await baseExpensesUseCases.GetMonthlyDestinyCategory(month, year, id, item.IdExpenseCategory)

            return handleExpenseData(item, categoryData)
        }))
    }
}

function handleExpenseData(item: expensecategories, categoryData: FullBaseExpenseChild[]) {
    let total = categoryData.reduce((old, item) => item.Active ? old + clientUtilsUseCases.GetExpensePrice(item) : old, 0)

    return {
        IdExpenseCategory: item.IdExpenseCategory,
        name: item.Description,
        tableData: categoryData,
        total: parseFloat(total.toFixed(2))
    }
}

//#region Interfaces / Types 

interface PageProps {
    params: {
        params: [Categories, string]
    }
}

type Categories = "banco" | "pessoal"

interface ExpenseTypeData {
    name: string
    data: CategoryData[]
}

export interface CategoryData {
    IdExpenseCategory: number
    name: string
    total: number
    tableData: FullBaseExpenseChild[]
}

//#endregion