import { BanksUseCases } from '../Banks/BanksUseCases'
import { banks, expensecategories } from '@prisma/client'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { UtilsUseCases } from '../Utils/UtilsUseCases'
import { FullBaseExpenseChild } from './generateFullBaseExpenseChild'
import { ExpenseCategoriesUseCases } from '../ExpenseCategories/ExpenseCategoriesUseCases'

export async function getMonthlyBanksResume(month: number, year: number) {
    let banks = await BanksUseCases.getAll()
    let categories = await ExpenseCategoriesUseCases.getAll()

    return Promise.all(banks.map<Promise<BankResume>>((item) => generateBanksResume(month, year, categories, item)))
}

async function generateBanksResume(month: number, year: number, category: expensecategories[], bank: banks): Promise<BankResume> {
    let bankExpenses = await BaseExpensesUseCases.getMonthlyBankCategory(month, year, bank.IdBank)

    return {
        BankData: bank,
        TotalExpensesSum: bankExpenses.reduce((old, item) => old + UtilsUseCases.getExpensePrice(item), 0),
        Categories: category.map((item) => generateBankResumeDestiny(bankExpenses, item)),
    }
}

function generateBankResumeDestiny(bankExpenses: FullBaseExpenseChild[], category: expensecategories): BankResumeCategories {
    let destinyExpenses = bankExpenses.filter((subItem) => subItem.IdExpenseCategory === category.IdExpenseCategory)

    return {
        CategoryName: category.Description,
        ExpensesSum: destinyExpenses.reduce((old, item) => old + UtilsUseCases.getExpensePrice(item), 0)
    }
}

export interface BankResume {
    BankData: banks
    TotalExpensesSum: number
    Categories: BankResumeCategories[]
}

export interface BankResumeCategories {
    CategoryName: string
    ExpensesSum: number
}