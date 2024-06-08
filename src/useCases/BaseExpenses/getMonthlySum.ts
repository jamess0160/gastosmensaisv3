import { prisma } from '@/database/prisma'
import { utilsUseCases } from '../Utils/UtilsUseCases'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from '../../base'

export class GetMonthlySum extends BaseSection<BaseExpensesUseCases>{

    async run(month: number, year: number) {
        let data = await this.getMonthlyData(month, year)

        let fullData = await this.instance.GenerateFullBaseExpenseChild.run(data)

        return fullData.reduce((old, item) => old + utilsUseCases.GetExpensePrice(item), 0)
    }

    getMonthlyData(month: number, year: number) {
        return prisma.baseexpenses.findMany({
            where: {
                EntryDate: {
                    gte: utilsUseCases.monthAndYearToMoment(month, year).toDate(),
                    lt: utilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
                }
            }
        })
    }
}
