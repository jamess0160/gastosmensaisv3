import { prisma } from '@/database/prisma'

type CreateFixedExpenses = Parameters<typeof prisma.fixedexpenses.create>[0]['data']

export function create(data: CreateFixedExpenses) {

}