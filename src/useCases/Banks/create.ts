import { prisma } from '@/database/prisma'

type CreateBank = Parameters<typeof prisma.banks.create>[0]['data']

export function create(data: CreateBank) {
    return prisma.banks.create({ data })
}
