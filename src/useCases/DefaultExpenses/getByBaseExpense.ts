import { prisma } from '@/database/prisma'

export function getByBaseExpense(IdBaseExpenses: number[]) {
    return prisma.defaultexpenses.findMany({
        where: {
            IdBaseExpense: { in: IdBaseExpenses }
        }
    })
}