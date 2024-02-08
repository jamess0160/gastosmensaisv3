import { prisma } from '@/database/prisma'

export function remove(IdBaseExpense: number) {
    return prisma.baseexpenses.delete({
        where: { IdBaseExpense }
    })
}
