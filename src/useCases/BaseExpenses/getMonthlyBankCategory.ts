import { prisma } from '@/database/prisma'
import { UtilsUseCases } from '../Utils/UtilsUseCases'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'

export async function getMonthlyBankCategory(month: number, year: number, IdBank: number, IdExpenseCategory?: number) {
    let baseExpenses = await getExpenseData(month, year, IdBank, IdExpenseCategory)

    return BaseExpensesUseCases.generateFullBaseExpenseChild(baseExpenses)
}

function getExpenseData(month: number, year: number, IdBank: number, IdExpenseCategory?: number) {
    return prisma.baseexpenses.findMany({
        where: {
            EntryDate: {
                gte: UtilsUseCases.monthAndYearToMoment(month, year).toDate(),
                lt: UtilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
            },
            IdBank: IdBank,
            IdExpenseCategory: IdExpenseCategory,
        }
    })
}