import { prisma } from '@/database/prisma'

type UpdateBaseExpense = Parameters<typeof prisma.baseexpenses.update>[0]['data']

export function update(IdBaseExpense: number, data: UpdateBaseExpense) {
    return prisma.baseexpenses.update({
        where: { IdBaseExpense },
        data: data
    })
}