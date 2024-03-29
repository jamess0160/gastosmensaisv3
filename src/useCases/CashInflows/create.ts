import { prisma } from '@/database/prisma'

type CreateCashInFlow = Parameters<typeof prisma.cashinflows.create>[0]['data']

export function create(data: CreateCashInFlow) {
    return prisma.cashinflows.create({ data })
}
