import { prisma } from '@/database/prisma'
import { clientUtilsUseCases } from '../Utils/ClientUtilsUseCases'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from "@/base/baseSection";

export class GetMonthlySum extends BaseSection<BaseExpensesUseCases>{

    async run(month: number, year: number) {
        let data = await this.getMonthlyData(month, year)

        let fullData = await this.instance.GenerateFullBaseExpenseChild.run(data)

        return fullData.reduce((old, item) => old + clientUtilsUseCases.GetExpensePrice(item), 0)
    }

    getMonthlyData(month: number, year: number) {
        return prisma.baseexpenses.findMany({
            where: {
                EntryDate: {
                    gte: clientUtilsUseCases.monthAndYearToMoment(month, year).toDate(),
                    lt: clientUtilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
                }
            }
        })
    }
}
