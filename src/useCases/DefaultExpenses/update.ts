import { prisma } from '@/database/prisma'

type UpdateDefaultExpenses = Parameters<typeof prisma.defaultexpenses.update>[0]['data']

export function update(IdDefaultExpense: number, data: UpdateDefaultExpenses) {
    return prisma.defaultexpenses.update({
        where: { IdDefaultExpense },
        data: data
    })
}
