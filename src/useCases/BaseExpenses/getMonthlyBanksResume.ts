import { banks, expensecategories } from '@prisma/client'
import { FullBaseExpenseChild } from './generateFullBaseExpenseChild'
import { BaseSection } from "@/base/baseSection";
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { banksUseCases } from '../Banks/BanksUseCases'
import { expenseCategoriesUseCases } from '../ExpenseCategories/ExpenseCategoriesUseCases'
import { clientUtilsUseCases } from '../Utils/ClientUtilsUseCases'

export class GetMonthlyBanksResume extends BaseSection<BaseExpensesUseCases> {

    async run(month: number, year: number) {
        let banks = await banksUseCases.getAll()
        let categories = await expenseCategoriesUseCases.getAll()

        return Promise.all(banks.map<Promise<BankResume>>((item) => this.generateBanksResume(month, year, categories, item)))
    }

    private async generateBanksResume(month: number, year: number, category: expensecategories[], bank: banks): Promise<BankResume> {
        let bankExpenses = await this.instance.GetMonthlyBankCategory(month, year, bank.IdBank)

        return {
            BankData: bank,
            TotalExpensesSum: bankExpenses.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item), 0),
            Categories: category.map((item) => this.generateBankResumeDestiny(bankExpenses, item)),
        }
    }

    private generateBankResumeDestiny(bankExpenses: FullBaseExpenseChild[], category: expensecategories): BankResumeCategories {
        let destinyExpenses = bankExpenses.filter((subItem) => subItem.IdExpenseCategory === category.IdExpenseCategory)

        return {
            IdExpenseCategory: category.IdExpenseCategory,
            CategoryName: category.Description,
            ExpensesSum: destinyExpenses.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item), 0)
        }
    }
}


//#region Interfaces / Types 

export interface BankResume {
    BankData: banks
    TotalExpensesSum: number
    Categories: BankResumeCategories[]
}

export interface BankResumeCategories {
    IdExpenseCategory: number
    CategoryName: string
    ExpensesSum: number
}

//#endregion