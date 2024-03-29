import { prisma } from '@/database/prisma'

export function getByBaseExpense(IdBaseExpenses: number[]) {
    return prisma.installmentexpenses.findMany({
        where: {
            IdBaseExpense: { in: IdBaseExpenses }
        }
    })
}