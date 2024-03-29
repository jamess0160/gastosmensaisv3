import { prisma } from '@/database/prisma'

type UpdateFixedExpenses = Parameters<typeof prisma.fixedexpenses.update>[0]['data']

export function update(IdFixedExpense: number, data: UpdateFixedExpenses) {
    return prisma.fixedexpenses.update({
        where: { IdFixedExpense },
        data: data
    })
}
