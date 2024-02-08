import { prisma } from '@/database/prisma'

export function remove(IdFixedExpense: number) {
    return prisma.fixedexpenses.delete({
        where: { IdFixedExpense }
    })
}
