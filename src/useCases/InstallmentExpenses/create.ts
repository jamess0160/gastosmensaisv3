import { prisma } from '@/database/prisma'

type CreateInstallmentExpenses = Parameters<typeof prisma.installmentexpenses.create>[0]['data']

export function create(data: CreateInstallmentExpenses) {
    return prisma.installmentexpenses.create({ data })
}
