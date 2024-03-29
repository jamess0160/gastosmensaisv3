import { prisma } from '@/database/prisma'

type CreateDefaultExpenses = Parameters<typeof prisma.defaultexpenses.create>[0]['data']

export function create(data: CreateDefaultExpenses) {
    return prisma.defaultexpenses.create({ data })
}
