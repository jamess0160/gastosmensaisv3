import { prisma } from '@/database/prisma'

type CreateBaseExpense = Parameters<typeof prisma.baseexpenses.create>[0]['data']

export function create(data: CreateBaseExpense) {
    return prisma.baseexpenses.create({ data })
}
