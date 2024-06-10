import { prisma } from '@/database/prisma'
import { clientUtilsUseCases } from '../Utils/ClientUtilsUseCases'
import { BaseExpensesUseCases } from './BaseExpensesUseCases'
import { BaseSection } from "@/base/baseSection";

export class GetMonthlyBankCategory extends BaseSection<BaseExpensesUseCases>{

    async run(month: number, year: number, IdBank: number, IdExpenseCategory?: number) {
        let baseExpenses = await this.getExpenseData(month, year, IdBank, IdExpenseCategory)

        return this.instance.GenerateFullBaseExpenseChild.run(baseExpenses)
    }

    private getExpenseData(month: number, year: number, IdBank: number, IdExpenseCategory?: number) {
        return prisma.baseexpenses.findMany({
            where: {
                EntryDate: {
                    gte: clientUtilsUseCases.monthAndYearToMoment(month, year).toDate(),
                    lt: clientUtilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
                },
                IdBank: IdBank,
                IdExpenseCategory: IdExpenseCategory
            }
        })
    }
}