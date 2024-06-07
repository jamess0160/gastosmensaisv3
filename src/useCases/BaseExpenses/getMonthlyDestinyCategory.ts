import { prisma } from '@/database/prisma'
import { utilsUseCases } from '../Utils/UtilsUseCases'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from '../../base'

export class GetMonthlyDestinyCategory extends BaseSection<BaseExpensesUseCases>{

    async run(month: number, year: number, IdDestiny: number, IdExpenseCategory: number) {
        let destinyExpenses = await this.getDestinyExpenses(month, year, IdDestiny, IdExpenseCategory)

        return this.instance.GenerateFullBaseExpenseChild.run(destinyExpenses)
    }

    private getDestinyExpenses(month: number, year: number, IdDestiny: number, IdExpenseCategory: number) {
        return prisma.baseexpenses.findMany({
            where: {
                EntryDate: {
                    gte: utilsUseCases.monthAndYearToMoment(month, year).toDate(),
                    lt: utilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
                },
                IdDestiny: IdDestiny,
                IdExpenseCategory: IdExpenseCategory,
            }
        })
    }
}
