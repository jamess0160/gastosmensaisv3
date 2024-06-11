import { BaseSection } from "@/base/baseSection"
import { ExpensesUseCase } from "./ExpensesUseCase"
import { FullBaseExpenseChild } from "../BaseExpenses/generateFullBaseExpenseChild"
import { expenseCategoriesUseCases } from "../ExpenseCategories/ExpenseCategoriesUseCases"
import { expensecategories } from "@prisma/client"
import { banksUseCases } from "../Banks/BanksUseCases"
import { baseExpensesUseCases } from "../BaseExpenses/BaseExpensesUseCases"
import { destinysUseCases } from "../Destinys/DestinysUseCases"
import { clientUtilsUseCases } from "../Utils/ClientUtilsUseCases"

export class GetCategoriesData extends BaseSection<ExpensesUseCase> {

    async run(type: Categories, id: number, month: number, year: number): Promise<ExpenseTypeData> {
        let expenseCategories = await expenseCategoriesUseCases.getAll()

        if (type === "banco") {
            return this.getBanksData(id, expenseCategories, month, year)
        }

        if (type === "pessoal") {
            return this.getDestinyData(id, expenseCategories, month, year)
        }

        throw new Error("type não é válido")
    }

    async getBanksData(id: number, expenseCategories: expensecategories[], month: number, year: number): Promise<ExpenseTypeData> {
        let bank = await banksUseCases.getFirstBy({ IdBank: id })

        if (!bank) throw new Error("Banco não encontrado!")

        return {
            name: bank.Name,
            data: await Promise.all(expenseCategories.map<Promise<CategoryData>>(async (item) => {
                let categoryData = await baseExpensesUseCases.GetMonthlyBankCategory(month, year, id, item.IdExpenseCategory)

                return this.handleExpenseData(item, categoryData)
            }))
        }
    }

    async getDestinyData(id: number, expenseCategories: expensecategories[], month: number, year: number): Promise<ExpenseTypeData> {
        let destiny = await destinysUseCases.getFirstBy({ IdDestiny: id })

        if (!destiny) throw new Error("Destino não encontrado!")

        return {
            name: destiny.Name,
            data: await Promise.all(expenseCategories.map<Promise<CategoryData>>(async (item) => {
                let categoryData = await baseExpensesUseCases.GetMonthlyDestinyCategory(month, year, id, item.IdExpenseCategory)

                return this.handleExpenseData(item, categoryData)
            }))
        }
    }

    handleExpenseData(item: expensecategories, categoryData: FullBaseExpenseChild[]) {
        let total = categoryData.reduce((old, item) => item.Active ? old + clientUtilsUseCases.GetExpensePrice(item) : old, 0)

        return {
            IdExpenseCategory: item.IdExpenseCategory,
            name: item.Description,
            tableData: categoryData,
            total: parseFloat(total.toFixed(2))
        }
    }

}

export type Categories = "banco" | "pessoal"

export interface ExpenseTypeData {
    name: string
    data: CategoryData[]
}

export interface CategoryData {
    IdExpenseCategory: number
    name: string
    total: number
    tableData: FullBaseExpenseChild[]
}