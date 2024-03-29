import { prisma } from '@/database/prisma'

type UpdateInstallmentExpenses = Parameters<typeof prisma.installmentexpenses.update>[0]['data']

export function update(IdInstallmentExpense: number, data: UpdateInstallmentExpenses) {
    return prisma.installmentexpenses.update({
        where: { IdInstallmentExpense },
        data: data
    })
}
