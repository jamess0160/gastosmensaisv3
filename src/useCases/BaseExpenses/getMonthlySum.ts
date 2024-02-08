import { prisma } from '@/database/prisma'
import { UtilsUseCases } from '../Utils/UtilsUseCases'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'

export async function getMonthlySum(month: number, year: number) {
    let data = await getMonthlyData(month, year)

    let fullData = await BaseExpensesUseCases.generateFullBaseExpenseChild(data)

    return fullData.reduce((old, item) => old + UtilsUseCases.getExpensePrice(item), 0)
}

function getMonthlyData(month: number, year: number) {
    return prisma.baseexpenses.findMany({
        where: {
            EntryDate: {
                gte: UtilsUseCases.monthAndYearToMoment(month, year).toDate(),
                lte: UtilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
            }
        }
    })
}