import { baseExpensesUseCases } from "@/useCases/BaseExpenses/BaseExpensesUseCases"
import { FullBaseExpenseChild } from "@/useCases/BaseExpenses/generateFullBaseExpenseChild"
import ExpenseType from "./components/expenseType"
import { expenseCategoriesUseCases } from "@/useCases/ExpenseCategories/ExpenseCategoriesUseCases"
import { expensecategories } from "@prisma/client"
import { cookies } from "next/headers"
import { destinysUseCases } from "@/useCases/Destinys/DestinysUseCases"
import { banksUseCases } from "@/useCases/Banks/BanksUseCases"
import { Container } from "@mui/material"
import { utilsUseCases } from "@/useCases/Utils/UtilsUseCases"

export default async function Page(props: PageProps) {

    let [type, id] = props.params.params

    let { name, data } = await getCategoriesData(type, parseInt(id))

    let parsedType = type === "banco" ? "Banco" : "Pessoal"

    return (
        <Container maxWidth="xl">
            <div className="fixed top-2 right-4">
                <h1 className="min-w-fit m-0 text-center underline" >{`${parsedType} - ${name}`}</h1>
            </div>
            <div className="pt-12">
                {data.map((item, index) => <ExpenseType id={`Category${item.IdExpenseCategory.toString()}`} key={index} CategorieData={item} />)}
            </div>
        </Container>
    )
}

async function getCategoriesData(type: Categories, id: number): Promise<aaaa> {
    let { month, year } = utilsUseCases.getMonthYear()

    let expenseCategories = await expenseCategoriesUseCases.getAll()

    if (type === "banco") {
        return getBanksData(id, expenseCategories, month, year)
    }

    if (type === "pessoal") {
        return getDestinyData(id, expenseCategories, month, year)
    }

    throw new Error("type não é válido")
}

async function getBanksData(id: number, expenseCategories: expensecategories[], month: number, year: number): Promise<aaaa> {
    let bank = await banksUseCases.getFirstBy({ IdBank: id })

    if (!bank) throw new Error("Banco não encontrado!")

    return {
        name: bank.Name,
        data: await Promise.all(expenseCategories.map<Promise<CategorieData>>(async (item) => {
            let categoryData = await baseExpensesUseCases.GetMonthlyBankCategory.run(month, year, id, item.IdExpenseCategory)

            return handleExpenseData(item, categoryData)
        }))
    }
}

async function getDestinyData(id: number, expenseCategories: expensecategories[], month: number, year: number): Promise<aaaa> {
    let destiny = await destinysUseCases.getFirstBy({ IdDestiny: id })

    if (!destiny) throw new Error("Destino não encontrado!")

    return {
        name: destiny.Name,
        data: await Promise.all(expenseCategories.map<Promise<CategorieData>>(async (item) => {
            let categoryData = await baseExpensesUseCases.GetMonthlyDestinyCategory.run(month, year, id, item.IdExpenseCategory)

            return handleExpenseData(item, categoryData)
        }))
    }
}

function handleExpenseData(item: expensecategories, categoryData: FullBaseExpenseChild[]) {
    let total = categoryData.reduce((old, item) => old + item.Price, 0)

    return {
        IdExpenseCategory: item.IdExpenseCategory,
        name: item.Description,
        tableData: categoryData,
        total: total
    }
}

//#region Interfaces / Types 

interface PageProps {
    params: {
        params: [Categories, string]
    }
}

type Categories = "banco" | "pessoal"

interface aaaa {
    name: string
    data: CategorieData[]
}

export interface CategorieData {
    IdExpenseCategory: number
    name: string
    total: number
    tableData: FullBaseExpenseChild[]
}

//#endregion