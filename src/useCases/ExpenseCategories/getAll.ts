import { prisma } from '@/database/prisma'

export function getAll() {
    return prisma.expensecategories.findMany()
}
