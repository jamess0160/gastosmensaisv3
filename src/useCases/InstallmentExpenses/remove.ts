import { prisma } from '@/database/prisma'

export function remove(IdInstallmentExpense: number) {
    return prisma.installmentexpenses.delete({
        where: { IdInstallmentExpense }
    })
}
