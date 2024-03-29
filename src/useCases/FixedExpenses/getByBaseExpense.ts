import { prisma } from '@/database/prisma'

export function getByBaseExpense(IdBaseExpenses: number[]) {
    return prisma.fixedexpenses.findMany({
        where: {
            IdBaseExpense: { in: IdBaseExpenses }
        }
    })
}