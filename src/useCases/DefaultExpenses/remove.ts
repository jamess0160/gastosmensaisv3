import { prisma } from '@/database/prisma'

export function remove(IdDefaultExpense: number) {
    return prisma.defaultexpenses.delete({
        where: { IdDefaultExpense }
    })
}
