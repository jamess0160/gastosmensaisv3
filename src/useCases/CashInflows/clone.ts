import { prisma } from '@/database/prisma'
import { CashInflowsUseCases } from './CashInflowsUseCases'

export async function clone(month: number, year: number) {
    let effectiveCashInflows = await CashInflowsUseCases.getAllByMY(month, year)

    return prisma.$transaction(effectiveCashInflows.map((item) => {
        return CashInflowsUseCases.create({
            Description: item.Description,
            IdDestiny: item.IdDestiny,
            Value: item.Value,
            EfectiveDate: new Date(),
        })
    }))
}
