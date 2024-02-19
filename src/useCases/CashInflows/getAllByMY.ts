import { prisma } from '@/database/prisma'
import { UtilsUseCases } from '../Utils/UtilsUseCases'

export function getAllByMY(month: number, year: number) {
    return prisma.cashinflows.findMany({
        where: {
            EfectiveDate: {
                gte: UtilsUseCases.monthAndYearToMoment(month, year).toDate(),
                lt: UtilsUseCases.monthAndYearToMoment(month, year).add(1, 'month').toDate(),
            }
        }
    })
}
