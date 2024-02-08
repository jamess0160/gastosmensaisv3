import { prisma } from '@/database/prisma'

export function remove(IdCashInflow: number) {
    return prisma.cashinflows.delete({
        where: { IdCashInflow }
    })
}
