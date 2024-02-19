import { prisma } from '@/database/prisma'
import { UtilsUseCases } from '../Utils/UtilsUseCases'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'

export async function getMonthlyDestinyCategory(month: number, year: number, IdDestiny: number, IdExpenseCategory: number) {
    let destinyExpenses = await getDestinyExpenses(month, year, IdDestiny, IdExpenseCategory)

    return BaseExpensesUseCases.generateFullBaseExpenseChild(destinyExpenses)
}

function getDestinyExpenses(month: number, year: number, IdDestiny: number, IdExpenseCategory: number) {
    return prisma.baseexpenses.findMany({
        where: {
            EntryDate: {
                gte: UtilsUseCases.monthAndYearToMoment(month, year).toDate(),
                lt: UtilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
            },
            IdDestiny: IdDestiny,
            IdExpenseCategory: IdExpenseCategory,
        }
    })
}