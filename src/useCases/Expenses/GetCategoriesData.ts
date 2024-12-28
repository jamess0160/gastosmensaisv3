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

    async run(type: Categories, IdUser: number, id: number, month: number, year: number): Promise<ExpenseTypeData> {
        let expenseCategories = await expenseCategoriesUseCases.getAllByUser(IdUser)

        if (type === "banco") {
            return this.getBanksData(IdUser, id, expenseCategories, month, year)
        }

        if (type === "pessoal") {
            return this.getDestinyData(IdUser, id, expenseCategories, month, year)
        }

        throw new Error("type não é válido")
    }

    async getBanksData(IdUser: number, id: number, expenseCategories: expensecategories[], month: number, year: number): Promise<ExpenseTypeData> {
        let bank = await banksUseCases.getFirstBy({ IdBank: id })

        if (!bank) throw new Error("Banco não encontrado!")

        let data = await Promise.all(expenseCategories.map<Promise<CategoryData>>(async (item) => {
            let categoryData = await baseExpensesUseCases.GetMonthlyBankCategory(month, year, IdUser, id, item.IdExpenseCategory)

            return this.handleExpenseData(item, categoryData)
        }))

        return {
            name: bank.Name,
            sumExpenses: parseFloat(data.reduce((old, item) => old + item.total, 0).toFixed(2)),
            sumInactives: parseFloat(data.reduce((old, item) => old + item.totalInactives, 0).toFixed(2)),
            data: data
        }
    }

    async getDestinyData(IdUser: number, id: number, expenseCategories: expensecategories[], month: number, year: number): Promise<ExpenseTypeData> {
        let destiny = await destinysUseCases.getFirstBy({ IdDestiny: id })

        if (!destiny) throw new Error("Destino não encontrado!")

        let data = await Promise.all(expenseCategories.map<Promise<CategoryData>>(async (item) => {
            let categoryData = await baseExpensesUseCases.GenerateFullBaseExpenseChild.run(month, year, IdUser, { IdDestiny: id, IdExpenseCategory: item.IdExpenseCategory })

            return this.handleExpenseData(item, categoryData)
        }))

        return {
            name: destiny.Name,
            sumExpenses: parseFloat(data.reduce((old, item) => old + item.total, 0).toFixed(2)),
            sumInactives: parseFloat(data.reduce((old, item) => old + item.totalInactives, 0).toFixed(2)),
            data: data
        }
    }

    handleExpenseData(item: expensecategories, categoryData: FullBaseExpenseChild[]): CategoryData {
        let totalActives = categoryData.reduce((old, item) => item.Active ? old + clientUtilsUseCases.GetExpensePrice(item) : old, 0)
        let totalInactives = categoryData.reduce((old, item) => item.Active ? old : old + clientUtilsUseCases.GetExpensePrice(item, { sumInactive: true }), 0)

        return {
            IdExpenseCategory: item.IdExpenseCategory,
            name: item.Description,
            tableData: categoryData,
            total: parseFloat(totalActives.toFixed(2)),
            totalInactives: parseFloat(totalInactives.toFixed(2)),
        }
    }

}

export type Categories = "banco" | "pessoal"

export interface ExpenseTypeData {
    name: string
    sumExpenses: number
    sumInactives: number
    data: CategoryData[]
}

export interface CategoryData {
    IdExpenseCategory: number
    name: string
    total: number
    totalInactives: number
    tableData: FullBaseExpenseChild[]
}